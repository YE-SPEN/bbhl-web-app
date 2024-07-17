import Hapi from '@hapi/hapi';
import admin from 'firebase-admin';
import routes from './routes/index.js';
import { db } from './database.js';
import credentials from '../credentials.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

let server;

const start = async () => {
    server = Hapi.server({
        port: 8000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['Accept', 'Content-Type', 'Authorization']
            }
        }
    });

    routes.forEach(route => server.route(route));

    try {
        await db.connect();
        await server.start(); 
        console.log(`Server is listening on ${server.info.uri}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Stopping server...');

    try {
        await server.stop({ timeout: 10000 });
        db.end(); // Close database connection
        console.log('Server stopped');
    } catch (err) {
        console.error('Error stopping server:', err);
    }

    process.exit(0);
});

start();
