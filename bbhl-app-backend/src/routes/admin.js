import Boom from '@hapi/boom';
import { db } from '../database.js';

export const adminRoute = {
    method: 'GET',
    path: '/api/admin-hub',
    handler: async (req, h) => {
        const gameID = req.query.id;
        const year = req.query.year;

        const { results: upcomingGames } = await db.query(
            `SELECT s.*, DATE_FORMAT(s.date, '%m-%d-%Y') AS formatted_date
            FROM schedule s, teams t1, teams t2
                WHERE s.home_team = t1.name 
                AND s.away_team = t2.name
                AND s.status = 'scheduled'
            ORDER BY s.date, s.time`
        );

        const { results: rosters } = await db.query( 
            `SELECT ps.name, p.id, p.position, t.name AS team
            FROM player_stats ps, players p, teams t
            WHERE t.name = ps.team
                AND ps.name = p.name
                AND ps.season = ?
                AND t.name IN (SELECT home_team AS teams
                                FROM schedule
                                    WHERE game_id = ?
                                UNION ALL
                                SELECT away_team AS teams
                                FROM schedule
                                    WHERE game_id = ?)`,
            [year, gameID, gameID]
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
}