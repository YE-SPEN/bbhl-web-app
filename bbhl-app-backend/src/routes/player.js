import Boom from '@hapi/boom';
import { db } from '../database.js';

export const playerRoute = {
    method: 'GET',
    path: '/api/players/{id}',
    handler: async (req, h) => {
        const id = req.params.id;
        
        const { results: playerInfo } = await db.query(
            `SELECT * FROM players
            WHERE id = ?`,
            [id],
        );
        const player = playerInfo[0];
        
        if (!player) throw Boom.notFound(`Player not found in BBHL Database`);
        
        const { results: playerStats } = await db.query(
            `SELECT ps.*, t.id, t.logo FROM players p, player_stats ps, teams t
            WHERE p.name = ps.name
                AND t.name = ps.team
                AND p.id = ?
            ORDER BY ps.season DESC`,
            [id],
        );
        //const stats = playerStats;

        const { results: goalieStats } = await db.query(
            `SELECT gs.*, t.id, t.logo FROM players p, goalie_stats gs, teams t
            WHERE p.name = gs.name
                AND t.name = gs.team
                AND p.id = ?
            ORDER BY gs.season DESC`,
            [id],
        );

        return { player, playerStats, goalieStats };
    }
}