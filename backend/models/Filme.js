const mongoose = require('mongoose');

const FilmSchema = new mongoose.Schema({
  titel: String,
  bildUrl: String,
  beschreibung: String,
  dauer: Number,
  fsk: Number,
}, {
  collection: 'Filmliste'
});


const Film = mongoose.model('Film', FilmSchema);


module.exports = { Film};
