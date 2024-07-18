import { db } from './src/database.js';

const testConnection = async () => {
    try {
        await db.connect();
        const result = await db.query('SELECT 1 + 1 AS solution');
        console.log('Query result:', result);
    } catch (error) {
        console.error('Error executing query:', error);
    } finally {
        await db.end(); // Ensure the connection is closed
    }
};

testConnection();
