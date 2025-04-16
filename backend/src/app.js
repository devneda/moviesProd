const express = require('express');
const cors = require('cors');
const knex = require('knex');
const fs = require('fs');
const multer = require('multer');

const IMAGES_PATH = './images';
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(IMAGES_PATH))

const multerStorage = multer.diskStorage({
    destination: IMAGES_PATH,
    filename: (req, file, cb) => {
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() * 1000);
        const extension = file.mimetype.slice(file.mimetype.indexOf('/') + 1);
        cb(null, file.fieldname + '-' + uniqueSufix + '-' + extension);
    }
});

const upload = multer({storage: multerStorage});

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

app.post('/movies', upload.single('image'), async (req, res) => {
    try{
        const { title, description, year } = req.body;

        if ( !title || !description || !year ) {
            return res.status(400).json({message: 'Faltan campos obligatorios'});
        }

        if ( !req.file ) {
            return res.status(400).json({message: 'No se ha proporcionado ninguna imagen'});
        }

        const filename = req.file.filename;

        if (!fs.existsSync(IMAGES_PATH)) {
            fs.mkdirSync(IMAGES_PATH);
        }

        await db('movies').insert({
            title: req.body.title,
            description: req.body.description,
            year: req.body.year
        });

        res.status(201).json({});
    } catch (error) {
        console.error('Error al guardad pelicula: ', error);
        res.status(500).json({message: 'Error interno del servidor'});
    }
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

// Esto parece no funcionar porque hay dos endpoints de tipo POST y se genera conflicto **LO DEJO COMENTADO
/* app.post('/movies', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: 'No se ha proporcionado ninguna imagen'
        });
    }

    if (!fs.existsSync(IMAGES_PATH)) {
        fs.mkdirSync(IMAGES_PATH);
    }

    //TODO debería guardar los metadatos de la imagen en la bbdd, ahora dejo lo más basico
    console.log(req.body.title);
    console.log(req.file.filename);

    return res.json({
        message: 'Imagen agregada correctamente',
        filename: req.file.fieldname
    });
});
 */
app.listen(8080, () => {
    console.log('El backend ha iniciado en el puerto 8080');
});