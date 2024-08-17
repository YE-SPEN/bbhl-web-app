import Boom from '@hapi/boom';
import { db } from '../database.js';

export const newPlayerRoute = {
    method: 'POST',
    path: '/api/admin-hub/new-player',
    handler: async (req, h) => {
        try {
            const { id, name, position, picture } = req.payload;

            const query = `
                INSERT INTO players (id, name, position, picture)
                VALUES (?, ?, ?, ?)
                `;
            const result = await db.query(query, [id, name, position, picture]);

            return h.response(result).code(201);
        }
        catch (error) {
            return h.response(error.message).code(500);
        }
    }
}