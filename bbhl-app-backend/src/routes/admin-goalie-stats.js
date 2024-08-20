import Boom from '@hapi/boom';
import { db } from '../database.js';

export const adminGoalieStatsRoute = {
    method: 'POST',
    path: '/api/admin-hub/goalie-stats',
    handler: async (req, h) => {
        const { game_id, player, wins, losses, ties, goals_against, shots_against, saves, shutouts } = req.payload;

        try {
            await db.query(
                `INSERT INTO goalie_boxscores (game_id, player, wins, losses, ties, goals_against, shots_against, saves, shutouts)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [game_id, player, wins, losses, ties, goals_against, shots_against, saves, shutouts]
            );
            return { message: 'Goalie Boxscore successfully recorded'};
        } catch (error) {
            return h.response({ error: error.message }).code(500);
        }
    }
}