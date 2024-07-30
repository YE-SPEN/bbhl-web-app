import Boom from '@hapi/boom';
import { db } from '../database.js';

export const bbhldokuAnswerRoute = [
    {
        method: 'POST',
        path: '/api/bbhldoku/answer',
        handler: async (req, h) => {
            const { player, team1, team2 } = req.payload;

            try {
                await db.query(
                    `INSERT INTO Doku_Answers (player, team_1, team_2)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE guessed = guessed + 1`,
                        [player, team1, team2]
                );
                return { message: 'Answer Successfully Recorded'};
            } catch (error) {
                return h.response({ error: error.message }).code(500);
            }
        }
    }
]