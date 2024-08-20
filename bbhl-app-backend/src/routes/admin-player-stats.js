import Boom from '@hapi/boom';
import { db } from '../database.js';

export const adminPlayerStatsRoute = {
    method: 'POST',
    path: '/api/admin-hub/player-stats',
    handler: async (req, h) => {
        const { game_id, player, goals, assists, points, pims, gwg } = req.payload;

        try {
            await db.query(
                `INSERT INTO boxscores (game_id, player, goals, assists, points, pims, gwg)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [game_id, player, goals, assists, points, pims, gwg]
            );
            return { message: 'Player Boxscore successfully recorded'};
        } catch (error) {
            return h.response({ error: error.message }).code(500);
        }
    }
}