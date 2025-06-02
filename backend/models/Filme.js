const mongoose = require('mongoose');

// Definiere das Schema für einen Film
const FilmSchema = new mongoose.Schema({
  titel: String,
  bildUrl: String,
  beschreibung: String,
  dauer: Number,
  fsk: Number,
}, {
  collection: 'Filmliste' // Optional: expliziter Collection-Name in MongoDB
});

// Erstelle das Mongoose-Modell
const Film = mongoose.model('Film', FilmSchema);

// Exportiere das Modell als Einzelwert
module.exports = Film;
