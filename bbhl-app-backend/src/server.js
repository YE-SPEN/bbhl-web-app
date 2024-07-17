import Hapi from '@hapi/hapi';
import admin from 'firebase-admin';
import routes from './routes/index.js';
import { db } from './database';
import credentials from '../credentials.json';
import HapiCors from 'hapi-cors';

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

let server;

const start = async () => {
    server = Hapi.server({
        port: 8000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });

    routes.forEach(route => server.route(route));

    try {
        await db.connect(); 
        await server.register(HapiCors); 
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
