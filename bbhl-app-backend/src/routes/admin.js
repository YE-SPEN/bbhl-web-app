import Boom from '@hapi/boom';
import { db } from '../database.js';

export const adminRoute = [
    {
        method: 'GET',
        path: '/api/admin-hub',
        handler: async (req, h) => {
            const gameID = req.query.id;

            const { results: upcomingGames } = await db.query(
                `SELECT s.*, DATE_FORMAT(s.date, '%m-%d-%Y') AS formatted_date
                FROM schedule s, teams t1, teams t2
                    WHERE s.home_team = t1.name 
                    AND s.away_team = t2.name
                    AND s.status = 'scheduled'
                ORDER BY s.date, s.time`
            );

            const { results: rosters } = await db.query( 
                `SELECT ps.name, p.id, t.name AS team
                FROM player_stats ps, players p, teams t
                WHERE t.name = ps.team
                    AND ps.name = p.name
                    AND ps.season = 2024
                    AND t.name IN (SELECT home_team AS teams
                                    FROM schedule
                                        WHERE game_id = ?
                                    UNION ALL
                                    SELECT away_team AS teams
                                    FROM schedule
                                        WHERE game_id = ?)`,
                [gameID, gameID]
            );

            const { results: teams } = await db.query( 
                `SELECT DISTINCT id, name, logo 
                FROM teams t, schedule s
                WHERE t.name IN (SELECT home_team AS teams
                                FROM schedule
                                    WHERE game_id = ?
                                UNION ALL
                                SELECT away_team AS teams
                                FROM schedule
                                    WHERE game_id = ?)`,
                [gameID, gameID]
            );

            return { upcomingGames, rosters, teams };
        }
    },
    {
        method: 'POST',
        path: '/api/admin-hub/player-stats',
        handler: async (req, h) => {
            const { game_id, player, goals, assists, points, pims, gwg } = req.payload;

            try {
                await db.query(
                    `INSERT INTO Boxscores (game_id, player, goals, assists, points, pims, gwg)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [game_id, player, goals, assists, points, pims, gwg]
                );
                return { message: 'Boxscore successfully recorded'};
            } catch (error) {
                return h.response({ error: error.message }).code(500);
            }
        }
    },
    {
        method: 'POST',
        path: '/api/admin-hub/team-stats',
        handler: async (req, h) => {
            const { game_id, home_score, away_score } = req.payload;

            try {
                await db.query(
                    `UPDATE Schedule
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
]