// externe Imports
import React, { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

// interne Imports
import MenuButtons from "../components/MenuButtons";
import "./Buchungsseite.css";

function Buchungsseite() {
  //State-Variablen
  const [ausgewaehlteSitze, setAusgewaehlteSitze] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const qrRef = useRef(null);
  const [filmTitel, setFilmTitel] = useState("");
  const [datum, setDatum] = useState("");
  const [uhrzeit, setUhrzeit] = useState("");

  // IDs aus SessionStorage abrufen
  const filmId = sessionStorage.getItem("filmId");
  const vorstellungsId = sessionStorage.getItem("vorstellungsId");

  // Inhalt für QR-Code vorbereiten
  const qrCodeContent = JSON.stringify({
    filmId,
    vorstellungsId,
    sitze: ausgewaehlteSitze,
    filmTitel,
    datum,
    uhrzeit
  });

  const navigate = useNavigate();

  // Beim Laden: Sitze und Login-Status abrufen
  useEffect(() => {
    // Sitzplatzdaten aus SessionStorage laden
    const gespeicherteSitze = sessionStorage.getItem("ausgewählteSitze");
    if (gespeicherteSitze) {
      try {
        setAusgewaehlteSitze(JSON.parse(gespeicherteSitze));
      } catch (e) {
        console.error("Fehler beim Parsen der gespeicherten Sitze:", e);
      }
    }

    // Login-Status prüfen
    const userIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(userIsLoggedIn);

    // E-Mail aus LocalStorage laden (falls eingeloggt)
    if (userIsLoggedIn) {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  // Filmtitel laden
  useEffect(() => {
    const fetchFilmTitel = async () => {
      if (!filmId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/filme/${filmId}`);
        if (!res.ok) throw new Error("Film nicht gefunden");
        const filmData = await res.json();
        setFilmTitel(filmData.titel);
      } catch (err) {
        console.error("Fehler beim Laden des Filmtitels:", err);
      }
    };
    fetchFilmTitel();
  }, [filmId]);

  // Datum & Uhrzeit der Vorstellung abrufen
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const vorstellungenRes = await fetch(`http://localhost:5000/api/vorstellungen/${filmId}`);
        const vorstellungen = await vorstellungenRes.json();

        const matching = vorstellungen.find(v => v._id.toString() === vorstellungsId);
        console.log("Gefundene Vorstellung:", matching);

        if (matching) {
          const startzeit = new Date(matching.startzeit);
          const datum = startzeit.toLocaleDateString('de-DE');
          const uhrzeit = startzeit.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
          setDatum(datum);
          setUhrzeit(uhrzeit);
        } else {
          console.warn("Keine passende Vorstellung gefunden");
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (filmId && vorstellungsId) {
      fetchDetails();
    }
  }, [filmId, vorstellungsId]);

  // Validierung der E-Mail
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Buchung ausführen
  const handleBooking = async () => {
    setBookingMessage("");
    setMessageType("");

    // Validierungen
    if (ausgewaehlteSitze.length === 0) {
      setBookingMessage("Bitte wählen Sie zuerst Sitze aus.");
      setMessageType("error");
      return;
    }
    if (!isLoggedIn) {
      if (!email) {
        setBookingMessage("Bitte geben Sie eine Mail ein.");
        setMessageType("error");
        return;
      }
      if (!isValidEmail(email)) {
        setBookingMessage("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        setMessageType("error");
        return;
      }
    }

    // QR-Code generieren
    const qrCanvas = qrRef.current.querySelector("canvas");
    const dataUrl = qrCanvas.toDataURL();

    try {
      // 1) Ticket speichern
      const saveTicketResponse = await fetch("http://localhost:5000/api/save-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmId,
          vorstellungsId,
          sitze: ausgewaehlteSitze,
          userEmail: email,
        }),
      });

      if (!saveTicketResponse.ok) {
        const errText = await saveTicketResponse.text();
        throw new Error("Fehler beim Speichern des Tickets: " + errText);
      }

      // 2) E-Mail mit Ticket senden
      const mailResponse = await fetch("http://localhost:5000/api/send-booking-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          sitze: ausgewaehlteSitze,
          qrCode: dataUrl,
          filmTitel,
          datum,
          uhrzeit
        }),
      });

      if (!mailResponse.ok) {
        const errText = await mailResponse.text();
        throw new Error("Mailversand fehlgeschlagen: " + errText);
      }

      // Erfolgreiche Buchung
      setBookingMessage("✅ Buchung erfolgreich! Mail wurde versendet.");
      setMessageType("success");

      // Sitzplätze zurücksetzen
      sessionStorage.removeItem("ausgewählteSitze");
      setAusgewaehlteSitze([]);

      // Weiterleitung
      if (!isLoggedIn) {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setTimeout(() => {
          navigate("/Tickets");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setBookingMessage(`❌ Fehler: ${error.message}`);
      setMessageType("error");
    }
  };
  // ---------- JSX ----------
  return (
    <div className="booking-page-wrapper">
      <div className="buchungsseite-container">
        <h1>Buchung</h1>
        <h2>Deine ausgewählten Sitze:</h2>
        <ul>
          {ausgewaehlteSitze.map((sitz, index) => (
            <li key={index}>
              Reihe {sitz.reihe}, Platz {sitz.nummer} ({sitz.typ})
            </li>
          ))}
          {ausgewaehlteSitze.length === 0 && (
            <li className="no-seats-message">Keine Sitzdaten gefunden</li>
          )}
        </ul>

        {!isLoggedIn && (
          <div className="email-input-section">
            <h2>Deine E-Mail-Adresse:</h2>
            <input
              type="email"
              placeholder="Bitte E-Mail-Adresse eingeben"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (
                  bookingMessage &&
                  messageType === "error" &&
                  (bookingMessage.includes("Mail") || bookingMessage.includes("E-Mail-Adresse"))
                ) {
                  setBookingMessage("");
                  setMessageType("");
                }
              }}
              className="email-input-field"
              required
            />
            {bookingMessage &&
              messageType === "error" &&
              !isLoggedIn &&
              (bookingMessage.includes("Mail") || bookingMessage.includes("E-Mail-Adresse")) && (
                <div className={`booking-message ${messageType}`} style={{ marginTop: "10px" }}>
                  {bookingMessage}
                </div>
              )}
          </div>
        )}

        {bookingMessage &&
          (messageType === "success" ||
            (messageType === "error" && isLoggedIn) ||
            (messageType === "error" && !isLoggedIn && !(bookingMessage.includes("Mail") || bookingMessage.includes("E-Mail-Adresse")))) && (
            <div className={`booking-message ${messageType}`} style={{ marginBottom: "15px" }}>
              {bookingMessage}
            </div>
          )}

        <button
          onClick={handleBooking}
          className="booking-button"
          disabled={ausgewaehlteSitze.length === 0}
        >
          {isLoggedIn ? "Buchung bestätigen" : "Jetzt buchen"}
        </button>
      </div>

      <div ref={qrRef} style={{ display: "none" }}>
        <QRCodeCanvas value={qrCodeContent} size={500} />
      </div>

      <MenuButtons />
    </div>
  );
}

export default Buchungsseite;
