const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcrypt")
const User = require('./models/User');


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

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body; // email and password from request body
    const user = await mongoose.connection.db.collection('users').findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    // In a real application, you would hash and compare passwords securely.
    // For this example, we'll do a plain text comparison (NOT SECURE FOR PRODUCTION).
    if (bcrypt.compare(req.body.password, user.password)) { // Assuming 'password' field in your User collection
      // In a real app, establish a session (e.g., using express-session)
      // For now, we'll just indicate success.
      return res.json({ success: true, message: "Login successful!" });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;


    const existUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existUser) {
      return res.status(400).json({ message: 'Benutzername oder E-Mail schon vergeben' });
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();

    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});