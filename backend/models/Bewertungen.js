const mongoose = require('mongoose');

const BewertungenSchema = new mongoose.Schema({
  userName: String,
  ticketId: String,
  filmId: String,
  kommentar: String,
  sterne: {
  type: Number,
  min: 0,
  max: 5,
  required: true,
  validate: {
    validator: v => v * 10 % 5 === 0,
    message: props => `${props.value} ist keine gültige Bewertung`
  }
}
}, {
  collection: 'Bewertungen'
});

const Bewertungen = mongoose.model('Bewertungen', BewertungenSchema);

module.exports = Bewertungen;
