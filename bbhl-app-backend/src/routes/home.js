import Boom from '@hapi/boom';
import { db } from '../database';

export const homeRoute = {
    method: 'GET',
    path: '/api/home',
    handler: async (req, h) => {

        const { results: recentGames } = await db.query(
            `SELECT s.*, 
                    t1.logo AS home_team_logo, t1.id AS home_team_id,
                    t2.logo AS away_team_logo, t2.id AS away_team_id,
                    DATE_FORMAT(s.date, '%m-%d-%Y') AS formatted_date
            FROM schedule s, teams t1, teams t2
            WHERE s.home_team = t1.name 
            AND s.away_team = t2.name
            ORDER BY s.date, s.time
            LIMIT 3`
        );

        const { results: teamNames } = await db.query(
            `SELECT DISTINCT name FROM teams`
          );

        const { results: leagueLeaders} = await db.query(
            `SELECT ps.*, p.id, t.logo 
            FROM player_stats ps, players p, teams t
            WHERE ps.season = 2023
                AND ps.name = p.name
                AND ps.team = t.name
            ORDER BY ps.points DESC, ps.name DESC
            LIMIT 10`
        )

        return { recentGames, leagueLeaders, teamNames };
    }
}