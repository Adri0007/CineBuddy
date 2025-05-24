const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config({ path: "./config.env" })

const app = express();
app.use(cors());
app.use(express.json());




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