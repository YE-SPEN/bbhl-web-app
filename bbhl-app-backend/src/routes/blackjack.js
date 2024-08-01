import Boom from '@hapi/boom';
import { db } from '../database.js';

export const blackjackRoute = {
    method: 'GET',
    path: '/api/blackjack',
    handler: async (req, h) => {
        const { results: deck } = await db.query(
            `SELECT * FROM deck`
        );
        return deck;
    }
}
