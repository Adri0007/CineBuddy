import React, { useState } from 'react';
import './Anmeldung.css';
import { useNavigate } from 'react-router-dom';
import MenuButtons from "../components/MenuButtons";
import axios from 'axios';

function Anmeldung() {
  const [email, setEmail] = useState(''); // Eingabe für E-Mail
  const [password, setPassword] = useState(''); // Eingabe für Passwort
  const [message, setMessage] = useState(''); // Rückmeldung an den Nutzer
  const [messageType, setMessageType] = useState(''); // Art der Rückmeldung (success oder error)
  const navigate = useNavigate(); // Navigation in React Router

  // Wird beim Abschicken des Formulars ausgeführt
  const handleSubmit = async (e) => {
    e.preventDefault(); // Verhindert Neuladen der Seite

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      // Wenn Anmeldung erfolgreich
      if (response.data.success) {
        setMessage('✅ Anmeldung erfolgreich!');
        setMessageType('success');
        localStorage.setItem('isLoggedIn', 'true'); // Login-Status speichern
        localStorage.setItem('userEmail', email); // Nutzer-E-Mail speichern
        localStorage.setItem('userId', response.data.userId); // Nutzer-ID speichern

        setTimeout(() => {
          navigate('/Account'); // Weiterleitung zur Account-Seite
        }, 1000);
      } else {
        // Bei falschen Anmeldedaten
        setMessage(`❌ ${response.data.message}`);
        setMessageType('error');
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
      }
    } catch (error) {
      // Fehler beim Server
      console.error('Login error:', error);
      setMessage('❌ Serverfehler bei der Anmeldung.');
      setMessageType('error');
      localStorage.setItem('isLoggedIn', 'false');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Anmeldung</h2>

        {/* E-Mail-Eingabefeld */}
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          id="email"
          placeholder="E-Mail eingeben"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Passwort-Eingabefeld */}
        <label htmlFor="password">Passwort</label>
        <input
          type="password"
          id="password"
          placeholder="Passwort eingeben"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Rückmeldung anzeigen */}
        {message && <div className={`message ${messageType}`}>{message}</div>}

        {/* Absenden-Button */}
        <button type="submit">Anmelden</button>

        {/* Neuer Registrierungs-Link */}
        <div className="registration-prompt">
          Noch nicht angemeldet?{' '}
          <a href="/Registrieren" className="registration-link">
            Jetzt registrieren
          </a>
        </div>
      </form>

      {/* Navigationsmenü unten */}
      <MenuButtons />
    </div>
  );
}

export default Anmeldung;
