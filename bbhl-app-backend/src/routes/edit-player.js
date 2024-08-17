import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editPlayerRoute = {
    method: 'GET',
    path: '/api/admin-hub/edit-player',
    handler: async (req, h) => {
        try {
            const [allPlayers] = await db.query(
                `SELECT name, position, picture FROM players`
            );
            return { allPlayers };
        
        } catch (error) {
            console.error(error);
            throw Boom.internal('Failed to retrieve players');
        }
    }
};
