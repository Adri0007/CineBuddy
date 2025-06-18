require("dotenv").config({ path: "./.env" })

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcrypt")
const User = require('./models/User');
const Vorstellung = require('./models/Vorstellungen.js');

const nodemailer = require('nodemailer');


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
    const vorstellungen = await Vorstellung.find({ filmId: new ObjectId(filmId) });
    if (!vorstellungen || vorstellungen.length === 0) {
      return res.status(404).json({ message: "Vorstellung nicht gefunden" });
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
  } catch (err) { }
})

app.post('/api/login', async (req, res) => {
  try {

    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await mongoose.connection.db.collection('users').findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "Nutzer nicht gefunden!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({ success: true, message: "Login erfolgreich!" });
    } else {
      return res.json({ success: false, message: "Benutzername oder E-Mail ist falsch" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Serverfehler" });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

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



app.get('/api/vorstellung', async (req, res) => {
  try {
    const { filmId, date, time } = req.query;

    if (!filmId || !date || !time) {
      return res.status(400).json({ message: "filmId, date und time sind erforderlich" });
    }

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

app.get('/api/user-data', async (req, res) => {
  try {

    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Keine E-Mail übergeben" });

    const user = await User.findOne({ email }).select('username email');
    if (!user) return res.status(404).json({ error: "User nicht gefunden" });

    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Serverfehler" });

  }
});


//Alle Bewertungen von bestimmtem Film finden

const Bewertungen = require('./models/Bewertungen.js');

app.get('/api/bewertungen/:filmId', async (req, res) => {
  try {
    const filmId = req.params.filmId;
    const bewertungen = await Bewertungen.find({ filmId });
    res.json(bewertungen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Bewertungsdurchschnitt für Vorstellungsseite

app.get('/api/bewertungen/durchschnitt/:filmId', async (req, res) => {
  try {
    const result = await Bewertungen.aggregate([
      { $match: { filmId: req.params.filmId } },
      {
        $group: {
          _id: "$filmId",
          durchschnitt: { $avg: "$sterne" },
          anzahl: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({ durchschnitt: 0, anzahl: 0 });
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Berechnen des Durchschnitts' });
  }
});

// Neue Bewertung speichern

app.post('/api/bewertungen/:filmId', async (req, res) => {
  const { filmId } = req.params;
  const { sterne, kommentar, ticketId, userName } = req.body;

  try {
    const neueBewertung = new Bewertungen({
      filmId,
      sterne,
      kommentar,
      ticketId,
      userName,
    });
    await neueBewertung.save();
    res.status(201).json(neueBewertung);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Speichern der Bewertung' });
  }
});

//Alle Tickets von bestimmtem User finden per email

const Ticket = require('./models/Ticket.js');

app.get('/api/Ticket', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Keine E-Mail übergeben" });

    const ticket = await Ticket.find({ userEmail: email });
    res.json(ticket);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

//Vorstellung durch vorstellungsId holen

app.get('/api/vorstellung', async (req, res) => {
  try {
    const vorstellungsId  = req.query;
    if (!vorstellungsId) return res.status(400).json({ error: "Keine vorstellungsId übergeben" });

    const vorstellung = await Vorstellung.findById( vorstellungsId );
    res.json(vorstellung);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

  // Ab hier neu
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.PW,
    },
  });

  app.post('/api/send-booking-mail', async (req, res) => {
    const { email, sitze, qrCode, filmTitel, datum, uhrzeit} = req.body;

    if (!email || !sitze || !qrCode) {
      return res.status(400).json({ error: "Fehlende Daten" });
    }

    const sitzeListeHtml = sitze.map(s => `<li>Reihe ${s.reihe}, Platz ${s.nummer} (${s.typ})</li>`).join('');

    const user = await User.findOne({ email: email });
    const userName = user ? user.username : null;

    const mailOptions = {
      // from: '"CineBuddy" <mikado.dummy.acc@gmail.com>',
      from: '"CineBuddy" <CineBuddy@gmail.com>',
      to: email,
      subject: 'Dein Kinoticket und Buchungsbestätigung',
      html: `
      ${userName ? `<h1>Hallo ${userName}! Vielen Dank für deine Buchung!</h1>` : `<h1>Hallo Kinofan! Vielen Dank für deine Buchung!</h1>`}
      <h2>${filmTitel} - ${datum} - ${uhrzeit}</h2>
      <p>Hier sind deine gebuchten Sitzplätze:</p>
      <ul>${sitzeListeHtml}</ul>
      <p>Zeige diesen QR-Code beim Einlass vor:</p>
      <img src="${qrCode}" alt="QR Code im Anhang" style="width:500px; height:500px;" />
    `,
      attachments: [
        {
          filename: 'qrcode.png',
          path: qrCode,
          cid: 'qrcode'
        }
      ]
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Mail erfolgreich versendet" });
    } catch (error) {
      console.error("Fehler beim Mailversand:", error);
      res.status(500).json({ error: "Mailversand fehlgeschlagen" });
    }
  });

  app.post('/api/save-ticket', async (req, res) => {
    const { filmId, vorstellungsId, sitze, userEmail, qrCode } = req.body;


    if (!filmId || !vorstellungsId || !sitze || !userEmail /*|| !qrCode */) {
      return res.status(400).json({ error: "Fehlende Buchungsdaten" });
    }

    try {
      // 1. Ticket speichern
      const newTicket = new Ticket({
        filmId,
        vorstellungsId,
        sitze,
        userEmail,
        // qrCodeDataUrl: qrCode,
      });
      await newTicket.save();

      // 2. Sitzstatus in VorstellungSitze updaten
      // Angenommen, VorstellungSitze hat Felder: id_vorstellung, reihe, nummer, status
      const vorstellungObjId = new mongoose.Types.ObjectId(vorstellungsId);

      const bulkOps = sitze.map(sitz => ({
        updateOne: {
          filter: {
            vorstellungId: vorstellungObjId,
            "sitz.reihe": sitz.reihe,
            "sitz.nummer": sitz.nummer,
          },
          update: { $set: { status: "belegt" } }
        }
      }));

      const result = await VorstellungSitze.bulkWrite(bulkOps);

      res.status(201).json({
        message: "Ticket erfolgreich gespeichert und Sitze belegt",
        ticketId: newTicket._id,
        updateResult: result
      });
    } catch (error) {
      console.error("Fehler beim Speichern des Tickets oder Aktualisieren der Sitzplätze", error);
      res.status(500).json({ error: "Fehler beim Speichern des Tickets oder Aktualisieren der Sitzplätze", details: error.message });
    }
  });

  app.get('/api/ticket-details', async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: "Keine E-Mail übergeben" });

      // Alle Tickets für diesen User
      const tickets = await Ticket.find({ userEmail: email });

      const Film = require('./models/Filme.js');
      const Vorstellung = require('./models/Vorstellungen.js');
      const Saal = require('./models/Saal.js');

      // Alle Tickets mit Filmdaten/Datum/Saal anreichern
      const allTicketInfos = [];
      for (const ticket of tickets) {
        const film = await Film.findById(ticket.filmId);
        const vorstellung = await Vorstellung.findById(ticket.vorstellungsId);

        if (!vorstellung) continue; // Kein Vorstellungsobjekt gefunden, Ticket überspringen

        // Zeitfilter: Nur Tickets mit Vorstellung in der Zukunft!
        const vorstellungsDate = new Date(vorstellung.startzeit);
        if (vorstellungsDate < new Date()) continue; // Vergangenheit = überspringen

        const saal = await Saal.findById(vorstellung.saalId);

        // Alle Sitzplätze anzeigen (auch mehrere!)
        for (const sitz of ticket.sitze) {
          allTicketInfos.push({
            filmId: ticket.filmId,
            vorstellungsId: ticket.vorstellungsId,
            sitze: [sitz], // Pro Eintrag ein Sitz, für besseren QR!
            film: film ? film.titel : "",
            datum: vorstellungsDate.toLocaleDateString('de-DE'),
            uhrzeit: vorstellungsDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            saal: saal ? saal.name : "",
            reihe: sitz.reihe || "",
            platz: sitz.nummer || sitz.platz || ""
          });
        }
      }

      // Wenn keine Tickets, entsprechende Meldung
      if (allTicketInfos.length === 0) {
        return res.status(404).json({ error: "Kein Ticket gefunden" });
      }

      res.json({ tickets: allTicketInfos });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Serverfehler' });
    }
  });


  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));
