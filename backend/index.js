const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const mongoUrl = 'mongodb://admin:SWP2025Projekt@localhost:27017/cinebuddys?authSource=admin';

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
