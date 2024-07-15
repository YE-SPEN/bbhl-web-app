import { db } from '../database';

export const playerStatsRoute = {
    method: 'GET',
    path: '/api/players',
    handler: async (req, h) => {
        const year = req.query.year;

        const { results } = await db.query(
            `SELECT ps.*, p.position, p.id, t.logo FROM player_stats ps, players p, teams t
            WHERE ps.season = ?
                AND ps.name = p.name
                AND ps.team = t.name
            ORDER BY ps.points DESC, ps.name DESC`,
            [year],
        );
        return results;
    }
}