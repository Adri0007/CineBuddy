const mongoose = require("mongoose");

const SitzSchema = new mongoose.Schema({
  reihe: String,
  nummer: Number,
  typ: { type: String, default: "normal" },
});

const SaalSchema = new mongoose.Schema({
  name: String,
  sitze: [SitzSchema],
},{
    collection: "Saal"
});

const Saal = mongoose.model("Saal", SaalSchema);
 module.exports = Saal;