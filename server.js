
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const Multimedia = require('./models/Multimedia');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mostrar archivos de uploads
app.use('/uploads', express.static('uploads'));

// Conexión MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Mostrar formulario
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// CREATE
app.post(
    '/api/multimedia',
    upload.fields([
        { name: 'imagen', maxCount: 1 },
        { name: 'audio', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const nuevo = new Multimedia({
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                imagenUrl: '/uploads/' + req.files.imagen[0].filename,
                audioUrl: '/uploads/' + req.files.audio[0].filename
            });

            await nuevo.save();

            res.send('Elemento guardado correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al guardar');
        }
    }
);

// READ
app.get('/api/multimedia', async (req, res) => {
    try {
        const datos = await Multimedia.find();
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al leer');
    }
});

// UPDATE
app.put('/api/multimedia/:id', async (req, res) => {
    try {
        const actualizado = await Multimedia.findByIdAndUpdate(
            req.params.id,
            {
                titulo: req.body.titulo,
                descripcion: req.body.descripcion
            },
            { new: true }
        );

        res.json(actualizado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al actualizar');
    }
});

// DELETE
app.delete('/api/multimedia/:id', async (req, res) => {
    try {
        await Multimedia.findByIdAndDelete(req.params.id);
        res.send('Registro eliminado');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});