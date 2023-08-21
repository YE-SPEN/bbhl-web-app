import { db } from '../database';

export const scheduleRoute = {
    method: 'GET',
    path: '/api/schedule',
    handler: async (req, h) => {
        const { results: schedule } = await db.query(
            `SELECT s.*, 
                    t1.logo AS home_team_logo, t1.id AS home_team_id,
                    t2.logo AS away_team_logo, t2.id AS away_team_id,
                    DATE_FORMAT(s.date, '%m-%d-%Y') AS formatted_date
            FROM schedule s, teams t1, teams t2
            WHERE s.home_team = t1.name 
            AND s.away_team = t2.name
            ORDER BY s.date, s.time
        `);

      const { results: teamNames } = await db.query(
        `SELECT DISTINCT name FROM teams`
      );
  
      return { schedule, teamNames };
    }
}