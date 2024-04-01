import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 10000;

const db = new pg.Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: true,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/tbl/api', async (req, res) => {
    const query = await db.query('SELECT *, (1 - (next_weighin/initial_weighin)) * 100 AS weight FROM users ORDER BY weight DESC');
    const results = query.rows;
    const trophy = query.rows[0].username;
    //console.log(results);
    // res.render('index.ejs', {results, trophy});
    res.send(results);
});

app.post('/update/:name', async (req, res) => {
    const user = req.params.name;
    const weight1 = req.body.weight;
    const query = await db.query('UPDATE users SET next_weighin = $1 WHERE name = $2 ', [weight1, user]);

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Running on port ${port}.`);
});
