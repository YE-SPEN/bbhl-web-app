import { db } from './src/database.js';

db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) throw err;
    console.log('The solution is:', results[0].solution);
    db.end();
});
