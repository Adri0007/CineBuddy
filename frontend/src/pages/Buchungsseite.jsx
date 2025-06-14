import React, { useEffect, useState } from "react";
import './Buchungsseite.css'; // Die CSS-Datei ohne globale Stile
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';

function Buchungsseite() {
  const [ausgewaehlteSitze, setAusgewaehlteSitze] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [bookingMessage, setBookingMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const gespeicherteSitze = sessionStorage.getItem("ausgewählteSitze");
    if (gespeicherteSitze) {
      try {
        setAusgewaehlteSitze(JSON.parse(gespeicherteSitze));
      } catch (e) {
        console.error("Fehler beim Parsen der gespeicherten Sitze:", e);
      }
    }

    const userIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(userIsLoggedIn);

    if (userIsLoggedIn) {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBooking = async () => {
    setBookingMessage('');
    setMessageType('');

    if (ausgewaehlteSitze.length === 0) {
      setBookingMessage("Bitte wählen Sie zuerst Sitze aus.");
      setMessageType('error');
      return;
    }

    if (!isLoggedIn) {
      if (!email) {
        setBookingMessage("Bitte geben Sie eine Mail ein.");
        setMessageType('error');
        return;
      }
      if (!isValidEmail(email)) {
        setBookingMessage("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        setMessageType('error');
        return;
      }
    }

    const bookingDetails = {
      sitze: ausgewaehlteSitze,
      userEmail: email,
      timestamp: new Date().toISOString(),
    };

    console.log("Buchungsdetails:", bookingDetails);

    setBookingMessage('✅ Buchung erfolgreich!');
    setMessageType('success');
    sessionStorage.removeItem("ausgewählteSitze");
    setAusgewaehlteSitze([]);

    if (!isLoggedIn) {
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setTimeout(() => {
        navigate('/Tickets');
      }, 2000);
    }
  };

  return (
    // Neuer Wrapper, der die globalen Styles übernimmt
    <div className="booking-page-wrapper">
      <div className="buchungsseite-container">
        <h1>Buchung</h1>
        <h2>Deine ausgewählten Sitze:</h2>
        <ul>
          {ausgewaehlteSitze.map((sitz, index) => (
            <li key={index}>
              <span>Reihe {sitz.reihe}, Platz {sitz.nummer}</span>
              <span> ({sitz.typ})</span>
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
                if (bookingMessage && messageType === 'error' && (bookingMessage.includes("Mail") || bookingMessage.includes("E-Mail-Adresse"))) {
                  setBookingMessage('');
                  setMessageType('');
                }
              }}
              className="email-input-field"
              required
            />
            {bookingMessage && messageType === 'error' && !isLoggedIn && (bookingMessage.includes("Mail") || bookingMessage.includes("E-Mail-Adresse")) && (
              <div className={`booking-message ${messageType}`} style={{marginTop: '10px'}}>
                {bookingMessage}
              </div>
            )}
          </div>
        )}
        
        {bookingMessage && (messageType === 'success' || (messageType === 'error' && isLoggedIn) || (messageType === 'error' && !isLoggedIn && !(bookingMessage.includes("Mail") || bookingMessage.includes("E-Mail-Adresse")))) && (
          <div className={`booking-message ${messageType}`} style={{marginBottom: '15px'}}>
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

      <div>
        <button className="suchButton" onClick={() => navigate('/')}>
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="ticketButton" onClick={() => navigate('/Tickets')}>
          <FontAwesomeIcon icon={faTicket} />
        </button>
        <button className="accountButton" onClick={() => navigate('/Account')}>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </div> // Ende des neuen Wrappers
  );
}

export default Buchungsseite;