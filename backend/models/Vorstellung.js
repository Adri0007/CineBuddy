const mongoose = require("mongoose");

const VorstellungSchema = new mongoose.Schema({
  filmId: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
  saalId: { type: mongoose.Schema.Types.ObjectId, ref: "Saal" },
  startzeit: Date,
  endzeit: Date,
},{
    collection: "Vorstellungen"
});

const Vorstellung = mongoose.model("Vorstellung", VorstellungSchema);
module.exports = Vorstellung;
