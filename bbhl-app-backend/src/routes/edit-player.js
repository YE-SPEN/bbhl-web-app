import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editPlayerRoute = {
    method: 'GET',
    path: '/api/edit-player',
    handler: async (req, h) => {
            const { results: allPlayers } = await db.query(
                `SELECT name, position, picture FROM players`
            )
            return allPlayers;
    }
}
