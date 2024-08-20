import Boom from '@hapi/boom';
import { db } from '../database.js';

export const adminTeamStatsRoute = {
    method: 'POST',
    path: '/api/admin-hub/team-stats',
    handler: async (req, h) => {
        const { game_id, home_score, away_score } = req.payload;

        try {
            await db.query(
                `UPDATE schedule
                SET home_score = ?,
                    away_score = ?,
                    status = 'complete',
                    hasBoxscore = TRUE
                WHERE game_id = ?`,
                [home_score, away_score, game_id]
            );
            return { message: 'Boxscore successfully recorded'};
        } catch (error) {
            return h.response({ error: error.message }).code(500);
        }
    }
}