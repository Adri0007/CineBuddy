const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  filmId: { type: String, required: true },
  vorstellungsId: { type: String, required: true },
  sitze: [
    {
      reihe: String,
      nummer: String,
      typ: String,
    },
  ],
  userEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);

