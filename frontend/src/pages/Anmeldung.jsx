import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './Anmeldung.css';

export function Anmeldung() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' oder 'error'

  const handleSubmit = async (e) => { // Made async
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { // Changed to POST
        email,
        password,
      });

      if (response.data.success) {
        setMessage('✅ Anmeldung erfolgreich!');
        setMessageType('success');
        // You might want to redirect the user or update global state here
        // For example: window.location.href = '/Account';
      } else {
        setMessage(`❌ ${response.data.message}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Serverfehler bei der Anmeldung.');
      setMessageType('error');
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