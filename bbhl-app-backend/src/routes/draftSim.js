import { db } from '../database.js';

export const draftSimRoute = {
    method: 'GET',
    path: '/api/draft-sim',
    handler: async (req, h) => {

        const { results: teams } = await db.query(
            `SELECT name, logo, captain
            FROM teams
                WHERE id NOT IN ('kingsmen', 'churchers')`
        );

        const { results: captains } = await db.query(
            `SELECT name, position 
            FROM players
            WHERE name IN (SELECT captain
                            FROM teams
                            WHERE id NOT IN ('kingsmen', 'churchers'))`
        );

        const { results: players } = await db.query(
            `SELECT 
                ROW_NUMBER() OVER (ORDER BY p.player_rank DESC) AS draft_row,
                p.name, 
                p.position, 
                p.player_rank, 
                ps.games_played, 
                ps.goals, 
                ps.assists, 
                ps.points, 
                ps.ppg 
            FROM 
                players p 
            JOIN 
                player_stats ps
            ON 
                p.name = ps.name
            WHERE 
                p.player_rank IS NOT NULL
                AND ps.season = 2024
            ORDER BY 
                p.player_rank DESC;`
        );

        return { teams, captains, players };
    }
}