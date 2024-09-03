import Boom from '@hapi/boom';
import { db } from '../database.js';

export const newPlayerRoute = {
    method: 'POST',
    path: '/api/admin-hub/new-player',
    handler: async (req, h) => {
        try {
            const { id, oldName, name, position, picture, action } = req.payload;
            let result;
            
            if (action === 'add') {
                const query = `
                INSERT INTO players (id, name, position, picture)
                VALUES (?, ?, ?, ?)
                `;
                result = await db.query(query, [id, name, position, picture]);
                return h.response(result).code(201);
            }
            if (action === 'edit') {
                const query = `
                UPDATE players
                SET
                    name = ?,
                    position = ?,
                    picture = ?
                WHERE name = ?
                `;
                result = await db.query(query, [name, position, picture, oldName]);
                return h.response(result).code(200);
            }
            else {
                return h.response('Invalid action specified').code(400);
            }
        }
        catch (error) {
            console.error('Error handling new player request:', error);
            return h.response(error.message).code(500);
        }
    }
};
