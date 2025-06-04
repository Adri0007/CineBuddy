const mongoose = require("mongoose");

const vorstellungSchema = new mongoose.Schema({
  filmId: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
  saalId: { type: mongoose.Schema.Types.ObjectId, ref: "Saal" },
  startzeit: Date,
  endzeit: Date
}, { collection: "Vorstellungen" }); 

module.exports = mongoose.model("Vorstellung", vorstellungSchema);
