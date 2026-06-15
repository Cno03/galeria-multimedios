const mongoose = require('mongoose');

const MultimediaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    imagenUrl: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Multimedia', MultimediaSchema);