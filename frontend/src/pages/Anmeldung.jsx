import React, { useState } from 'react';
import './Anmeldung.css'; // Stelle sicher, dass deine CSS-Datei importiert wird
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate
import axios from 'axios';

function Anmeldung() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' oder 'error'
  const navigate = useNavigate(); // Hook für die Navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { // Changed to POST
        email,
        password,
      });

      if (response.data.success) {
        setMessage('✅ Anmeldung erfolgreich!');
        setMessageType('success');
        localStorage.setItem('isLoggedIn', 'true'); // Set login status
        localStorage.setItem('userEmail', email);

        setTimeout(() => {
          navigate('/Account'); // Redirect to Account page
        }, 1000); // Short delay to see the message
      } else {
        setMessage(`❌ ${response.data.message}`);
        setMessageType('error');
        localStorage.setItem('isLoggedIn', 'false'); // Set login status to false
        localStorage.removeItem('userEmail');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Serverfehler bei der Anmeldung.');
      setMessageType('error');
      localStorage.setItem('isLoggedIn', 'false'); // Set login status to false on server error
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
    </div>
  );
}

export default Anmeldung;