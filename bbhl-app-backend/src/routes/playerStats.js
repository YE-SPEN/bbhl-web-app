import { db } from '../database.js';

export const playerStatsRoute = {
    method: 'GET',
    path: '/api/players',
    handler: async (req, h) => {
        const year = req.query.year;

        const { results: playerStats } = await db.query(
            `SELECT ps.*, p.position, p.id, t.logo FROM player_stats ps, players p, teams t
            WHERE ps.season = ?
                AND ps.name = p.name
                AND ps.team = t.name
            ORDER BY ps.points DESC, ps.name DESC`,
            [year],
        );
        const players = playerStats;

        const { results: goalieStats } = await db.query(
            `SELECT gs.*, p.position, p.id, t.logo FROM goalie_stats gs, players p, teams t
            WHERE gs.season = ?
                AND gs.name = p.name
                AND gs.team = t.name
            ORDER BY gs.wins DESC, gs.name DESC`,
            [year],
        );
        const goalies = goalieStats;

        return { players, goalies };
    }
}