import Boom from '@hapi/boom';
import { db } from '../database.js';

export const homeRoute = {
    method: 'GET',
    path: '/home',
    handler: async (req, h) => {
        console.log('Handling request for /api/home');
        
        let recentGames;
        let teamNames;
        let leagueLeaders;
        
        try {
            console.log('Querying recent games');
            const recentGamesResult = await db.query(
                `SELECT s.*, 
                        t1.logo AS home_team_logo, t1.id AS home_team_id,
                        t2.logo AS away_team_logo, t2.id AS away_team_id,
                        DATE_FORMAT(s.date, '%m-%d-%Y') AS formatted_date
                FROM schedule s
                JOIN teams t1 ON s.home_team = t1.name 
                JOIN teams t2 ON s.away_team = t2.name
                ORDER BY s.date, s.time
                LIMIT 3`
            );
            recentGames = recentGamesResult.results;
            console.log('Recent games query successful:', recentGames);
            
            console.log('Querying team names');
            const teamNamesResult = await db.query(
                `SELECT DISTINCT name FROM teams`
            );
            teamNames = teamNamesResult.results;
            console.log('Team names query successful:', teamNames);
            
            console.log('Querying league leaders');
            const leagueLeadersResult = await db.query(
                `SELECT ps.*, p.id, t.logo 
                FROM player_stats ps
                JOIN players p ON ps.name = p.name
                JOIN teams t ON ps.team = t.name
                WHERE ps.season = 2023
                ORDER BY ps.points DESC, ps.name DESC
                LIMIT 10`
            );
            leagueLeaders = leagueLeadersResult.results;
            console.log('League leaders query successful:', leagueLeaders);

            return { recentGames, leagueLeaders, teamNames };

        } catch (error) {
            console.error('Error handling /api/home request:', error);
            return h.response({ error: error.message }).code(500);
        }
    }
}
