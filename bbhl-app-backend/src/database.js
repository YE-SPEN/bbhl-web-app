import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let connection;

const connect = async () => {
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 25060,
            ssl: {
                ca: fs.readFileSync(path.resolve(__dirname, '../certs/ca-certificate.cer'))
            }
        });
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
};

const query = async (queryString, escapedValues) => {
    try {
        const [results, fields] = await connection.query(queryString, escapedValues);
        return { results, fields };
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw error;
    }
};

const end = async () => {
    try {
        await connection.end();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error closing the database connection:', error.message);
        throw error;
    }
};

export const db = {
    connect,
    query,
    end,
};
