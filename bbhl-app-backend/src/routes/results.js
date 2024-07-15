import Boom from '@hapi/boom';
import { db } from '../database';

export const resultsRoute = {
    method: 'GET',
    path: '/api/results/{id}',
    handler: async (req, h) => {
        const gameID = req.params.id;
        
        const { results: gameInfo } = await db.query(
            `SELECT s.*, DATE_FORMAT(s.date, '%m-%d-%Y') AS formatted_date from schedule s
            WHERE game_id = ?`,
            [gameID]
        );

        const game = gameInfo[0];
        
        const { results: boxscore } = await db.query( 
            `SELECT p.name, p.id, b.goals, b.assists, b.points, b.gwg, b.pims, ps.team
            FROM players p
                JOIN boxscores b 
                    ON b.player = p.name
                JOIN schedule s
                    ON b.game_ID = s.game_ID
                JOIN player_stats ps
                    ON ps.name = p.name
            WHERE b.game_id = ?
                AND ps.season = 2024`,
            [gameID]
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

        return { game, boxscore, teams };
    }
}