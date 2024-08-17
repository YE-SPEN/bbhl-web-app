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
        const stats = playerStats;

        return { player, stats };
    }
}