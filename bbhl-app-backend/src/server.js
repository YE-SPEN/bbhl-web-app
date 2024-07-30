import path from 'path';
import Hapi from '@hapi/hapi';
import admin from 'firebase-admin';
import routes from './routes/index.js';
import { db } from './database.js';
import fs from 'fs';

console.log('Starting server initialization...');

const credentialsPath = path.resolve(process.cwd(), 'credentials.json');
console.log(`Resolved credentials path: ${credentialsPath}`);

const credentials = JSON.parse(fs.readFileSync(credentialsPath));
console.log('Credentials loaded successfully');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

let server;

const start = async () => {
    server = Hapi.server({
        port: process.env.PORT || 8000,
        host: '0.0.0.0',
        routes: {
            cors: true
        }
    });

    console.log('Server configuration set');

    // Log each route being registered
    routes.forEach(route => {
        console.log(`Registering route: ${route.method.toUpperCase()} ${route.path}`);
        server.route(route);
    });

    try {
        await db.connect();
        console.log('Database connected successfully');

        await server.start();
        console.log(`Server is listening on ${server.info.uri}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

process.on('unhandledRejection', err => {
    console.log('Unhandled rejection:', err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Stopping server...');

    try {
        await server.stop({ timeout: 10000 });
        await db.end(); // Close database connection
        console.log('Server stopped');
    } catch (err) {
        console.error('Error stopping server:', err);
    }

    process.exit(0);
});

// Start the server
start();
console.log('Server initialization script complete');
