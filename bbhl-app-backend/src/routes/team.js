import Boom from '@hapi/boom';
import { db } from '../database';

export const teamRoute = {
    method: 'GET',
    path: '/api/teams/{id}',
    handler: async (req, h) => {
        const teamID = req.params.id;
        const year = req.query.year;

        try {
            const { results: team } = await db.query( 
                `SELECT t.*, ts.wins, ts.losses, ts.ties
                FROM teams t, team_stats ts
                    WHERE ts.team = t.name 
                        AND ts.season = ?
                        AND t.id= ?`,
                 [year, teamID]
            );

            if (!team) {
                throw Boom.notFound(`Team not found in BBHL Database`);
            }

            const { results: seasons } = await db.query( 
                `SELECT season
                FROM team_stats ts JOIN teams t
                ON ts.team = t.name
                    WHERE t.id = ?
                ORDER BY season DESC`,
                [teamID]
            );

            const { results: roster } = await db.query( 
                `SELECT ps.*, p.position, p.id AS player_id FROM player_stats ps, teams t, players p
                    WHERE t.name = ps.team
                        AND ps.name = p.name
                        AND ps.season = ?
                        AND t.id = ?
                    ORDER BY ps.points DESC, ps.goals DESC`,
                 [year, teamID]
            );

            return { team, seasons, roster };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};
