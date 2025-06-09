const mongoose = require("mongoose");
const Film = require("../models/Filme");
const Saal = require("../models/Saal");
const Vorstellung = require("../models/Vorstellung");
const VorstellungSitze = require("../models/VorstellungSitze");

mongoose.connect("mongodb://localhost:27017/Cinebuddy");

async function generateVorstellungen() {
  try {
    const film = await Film.findOne({ _id: "682f47ba9855a28157d7eadb" });  // Hier Film angeben mit zb Film.findOne({ _id: "FilmId" });
    const saal = await Saal.findOne(); // Hier Saal angeben

    if (!film || !saal) {
      console.log("Kein Film oder Saal gefunden");
      return;
    }

    const zeiten = ["11:00", "14:00", "17:00", "20:00"]; //Uhrzeiten
    const heute = new Date();

    for (let tagOffset = 0; tagOffset < 7; tagOffset++) { //Tage im Vorraus
      const datum = new Date(heute);
      datum.setDate(datum.getDate() + tagOffset);

      for (const zeit of zeiten) {
        const [stunden, minuten] = zeit.split(":").map(Number);
        const startzeit = new Date(datum);
        startzeit.setHours(stunden, minuten, 0, 0);

        const endzeit = new Date(startzeit);
        endzeit.setMinutes(endzeit.getMinutes() + film.dauer);

        const vorstellung = await Vorstellung.create({
          filmId: film._id,
          saalId: saal._id,
          startzeit,
          endzeit,
        });

        const sitze = saal.sitze.map((sitz) => ({
          vorstellungId: vorstellung._id,
          sitz,
          status: "frei",
        }));

        await VorstellungSitze.insertMany(sitze);
        console.log(
          `Vorstellung für ${film.titel} am ${startzeit.toLocaleString()} erstellt`
        );
      }
    }

    console.log("Alle Vorstellungen und Sitzstatus wurden erstellt");
  } catch (err) {
    console.error("Fehler:", err);
  } finally {
    mongoose.connection.close();
  }
}

generateVorstellungen();
