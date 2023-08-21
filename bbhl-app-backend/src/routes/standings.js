import { db } from '../database';

export const standingsRoute = {
    method: 'GET',
    path: '/api/standings',
    handler: async (req, h) => {
        const year = req.query.year;

        const { results } = await db.query(
            `SELECT * FROM team_stats ts, teams t 
                WHERE ts.season = ?
                AND t.name = ts.team
            ORDER BY ts.points DESC, ts.wins DESC`,
            [year],
        );
        return results;
    }
}