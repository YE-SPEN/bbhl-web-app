import Boom from '@hapi/boom';
import { db } from '../database.js';

export const newGameRoute = {
    method: 'POST',
    path: '/api/admin-hub/new-game',
    handler: async (req, h) => {
        try {
            const { date, time, homeTeam, awayTeam, gameID } = req.payload;

            const query = `
                INSERT INTO schedule (date, time, home_team, away_team, game_id, status, season)
                VALUES (?, ?, ?, ?, ?, 'scheduled', 2024)
                `;
            const result = await db.query(query, [date, time, homeTeam, awayTeam, gameID]);

            return h.response(result).code(201);
        }
        catch (error) {
            return h.response(error.message).code(500);
        }
    }
}