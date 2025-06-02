const mongoose = require("mongoose");

const VorstellungSitzeSchema = new mongoose.Schema({
  vorstellungId: { type: mongoose.Schema.Types.ObjectId, ref: "Vorstellung" },
  sitz: {
    reihe: String,
    nummer: Number,
  },
  status: {
    type: String,
    enum: ["frei", "belegt"],
    default: "frei",
  },
},{
    collection: "VorstellungSitze"
});

const VorstellungSitze = mongoose.model("VorstellungSitze", VorstellungSitzeSchema);
module.exports = VorstellungSitze;
