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

app.get('/', async (req, res) => {
    const query = await db.query('SELECT *, (initial_weighin - next_weighin) AS weight FROM users ORDER BY weight DESC');
    const results = query.rows;
    const trophy = query.rows[0].username;
    //console.log(results);
    res.render('index.ejs', {results, trophy});
});

app.listen(port, () => {
    console.log(`Running on port ${port}.`);
});