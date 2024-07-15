import { db } from '../database';

export const bbhldokuRoute = [
    {
        method: 'GET',
        path: '/api/bbhldoku',
        handler: async (req, h) => {
            const team1 = req.query.row;
            const team2 = req.query.column;

            const { results: teams } = await db.query(
                `SELECT name, logo
                FROM teams`
            );

            const { results: players } = await db.query(
                `SELECT name
                FROM players`
            );

            const { results: answerSet } = await db.query(
                `SELECT ps1.name,
                    ROUND((COALESCE(dk.guessed, 0) / NULLIF(SUM(COALESCE(dk.guessed, 0)) OVER (PARTITION BY dk.team_1, dk.team_2), 0)) * 100, 1) AS uniqueness,
                    p.picture
                FROM players p 
                    JOIN player_stats ps1 ON p.name = ps1.name
                    JOIN player_stats ps2 ON ps1.name = ps2.name
                    LEFT JOIN doku_answers dk ON ps1.name = dk.player AND dk.team_1 = ? AND dk.team_2 = ?
                WHERE ps1.team = ? AND ps2.team = ?
                GROUP BY ps1.name, p.picture, dk.guessed
                ORDER BY 2 DESC;`,
                [team1, team2, team1, team2],
            );
            return { teams, players, answerSet };
        }
    },
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