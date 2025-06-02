const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require("dotenv").config({ path: "./config.env" })

const { ObjectId } = require('mongoose').Types; 

const app = express();
app.use(cors());
app.use(express.json());

//Für Dima nicht löschen
//const mongoUrl = 'mongodb://admin:SWP2025Projekt@localhost:27017/cinebuddys?authSource=admin';

const mongoUrl = 'mongodb://localhost:27017/Cinebuddy'

mongoose.connect(mongoUrl)
  .then(() => console.log('MongoDB verbunden!'))
  .catch(err => console.error('MongoDB Fehler:', err));

app.get('/', (req, res) => {
  res.send('Hallo von CineBuddy-Backend!');
});


app.get('/api/test', (req, res) => {
  res.json({ message: 'API funktioniert!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));

const Film = require('./models/Filme.js');

app.get('/api/filme', async (req, res) => {
  try {
    const filme = await Film.find();
    res.json(filme);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.get('/api/filme/:id', async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    if (!film) {
      return res.status(404).json({ message: 'Film nicht gefunden' });
    }
    res.json(film);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
app.get('/api/vorstellungen/:filmId', async (req, res) => {
  try {
    const filmId = req.params.filmId;
    const vorstellung = await mongoose.connection.db.collection('Vorstellungen')
      .findOne({ id_film: new ObjectId(filmId) });
    if (!vorstellung) {
      return res.status(404).json({ message: "Vorstellung nicht gefunden" });
    }
    res.json(vorstellung);
  } catch (err) {
    res.status(500).json({ error: "Serverfehler", details: err.message });
  }
});
*/
app.get('/api/vorstellungen/:filmId', async (req, res) => {
  try {
    const filmId = req.params.filmId;
    const vorstellungen = await mongoose.connection.db.collection('Vorstellungen')
      .find({ id_film: new ObjectId(filmId) })  // alle Vorstellungen mit diesem Film
      .toArray();

    if (vorstellungen.length === 0) {
      return res.status(404).json({ message: "Keine Vorstellungen gefunden" });
    }
    res.json(vorstellungen);
  } catch (err) {
    res.status(500).json({ error: "Serverfehler", details: err.message });
  }
});


app.get('/api/vorstellungen', async (req, res) => {
  try {
    const vorstellungen = await mongoose.connection.db.collection('Vorstellungen')
      .find()
      .toArray();
    res.json(vorstellungen);
  } catch (err) {
    res.status(500).json({ error: "Serverfehler", details: err.message });
  }
});


const Saal = require('./models/Saal.js');

app.get('/api/saal', async (req, res) => {
  try {
    const saele = await Saal.find();
    res.json(saele);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.get('/api/saal/:id', async (req, res) => {
  try {
    const saal = await Saal.findById(req.params.id);
    if (!saal) return res.status(404).json({ message: 'Saal nicht gefunden' });
    res.json(saal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const VorstellungSitze = require('./models/VorstellungSitze.js');

app.get('/api/vorstellungssitze/:vorstellungId', async (req, res) => {
  try {
    const vorstellungId = req.params.vorstellungId;
    const sitze = await VorstellungSitze.find({ id_vorstellung: vorstellungId });
    res.json(sitze);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.get('/api/vorstellungssitze', async (req, res) => {
  try {
    const sitze = await VorstellungSitze.find();
    res.json(sitze);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.get('/api/vorstellung', async (req, res) => {
  try {
    const { filmId, date, time } = req.query;

    if (!filmId || !date || !time) {
      return res.status(400).json({ message: "filmId, date und time sind erforderlich" });
    }

    // Datum-Formatierung beachten: ggf. anpassen je nachdem, wie das in DB gespeichert ist
    // Beispiel: date im Format "yyyy-mm-dd" oder "dd-mm-yyyy"? Hier nehme ich an "dd-mm-yyyy" bleibt so.

    // MongoDB-Suche mit ObjectId für filmId und passenden Feldern für date und time
    // Ich nehme an, in DB heißen die Felder so (bitte anpassen, falls anders):
    // id_film, datum, uhrzeit
    const vorstellung = await mongoose.connection.db.collection('Vorstellungen').findOne({
      id_film: new ObjectId(filmId),
      datum: date,
      uhrzeit: time,
    });

    if (!vorstellung) {
      return res.status(404).json({ message: "Vorstellung nicht gefunden" });
    }

    res.json(vorstellung);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverfehler", details: err.message });
  }
});
