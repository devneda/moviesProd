const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(express.json());
app.use(cors());

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'movies.db'
    },
    useNullAsDefault: true
});

//TODO mover todos estos datos a una bbdd 
/* const movies = [
    {
        'title': 'Batman',
        'description': 'Batman description',
        'year': 2003
    },
    {
        'title': 'Spiderman',
        'description': 'Spiderman description',
        'year': 1998
    },
    {
        'title': 'Superman',
        'description': 'Superman description',
        'year': 1980
    }
]; */

app.get('/movies', async (req, res) => {
    const movies = await db('movies').select('*');
    res.status(200).json(movies);
});

app.get('/movies/:movieId', async (req, res) => {
    //TODO buscar la pelicula y devolverla en formato JSON
    const movie = await db('movies').select('*').where({id: req.params.movieId}).first();
    res.status(200).json(movie);
});

app.post('/movies', async (req, res) => {
    await db('movies').insert({
        title: req.body.title,
        description: req.body.description,
        year: req.body.year
    });
    res.status(201).json({});
});

app.put('/movies/:movieId', async (req, res) => {
    await db('movies').where({id: req.params.movieId}).update({
        title: req.body.title,
        description: req.body.description,
        year: req.body.year
    });
    res.status(201).json({});
});

app.delete('/movies/:movieId', async (req, res) => {
    const id = req.params.movieId;
    await db('movies').del().where({id: id});
    res.status(204).json({});
});

app.listen(8080, () => {
    console.log('El backend ha iniciado en el puerto 8080');
});