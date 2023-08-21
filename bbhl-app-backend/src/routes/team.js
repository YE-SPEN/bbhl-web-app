import Boom from '@hapi/boom';
import { db } from '../database';

export const teamRoute = {
    method: 'GET',
    path: '/api/teams/{id}',
    handler: async (req, h) => {
        const teamName = req.params.id;
        const { results: currentTeam } = await db.query(
            `SELECT * FROM teams t, team_stats ts 
                WHERE ts.team = t.name 
                AND ts.season = 2023
                AND t.id=?`,
            [teamName],
        );
        const team = currentTeam[0];

        if (!team) throw Boom.notFound(`Team not found in BBHL Database`);

        const { results: teamRoster } = await db.query(
            `SELECT ps.*, p.id AS player_id FROM player_stats ps, teams t, players p
            WHERE t.name = ps.team
                AND ps.name = p.name
                AND t.id = ?
                AND ps.season = 2023
            ORDER BY ps.points DESC, ps.goals DESC`,
            [teamName],
        );
            const roster = teamRoster;

        return { team, roster };
    }
}