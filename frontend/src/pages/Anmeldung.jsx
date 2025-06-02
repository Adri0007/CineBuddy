import React, { useState } from 'react';
import './Anmeldung.css'; // Stelle sicher, dass deine CSS-Datei importiert wird
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate

function Anmeldung() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' oder 'error'
  const navigate = useNavigate(); // Hook für die Navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // 💡 DYNAMISCH: Hier würdest du normalerweise einen API-Call machen
    // Beispiel: fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })

    // Temporäre Platzhalter-Logik zur Demonstration
    if (email === 'test@example.com' && password === 'pass123') {
      setMessage('✅ Anmeldung erfolgreich!');
      setMessageType('success');
      localStorage.setItem('isLoggedIn', 'true'); // Setze den Anmeldestatus
      setTimeout(() => {
        navigate('/Account'); // Leite zur Account-Seite weiter
      }, 1000); // Kurze Verzögerung, um die Nachricht zu sehen
    } else {
      setMessage('❌ Ungültige E-Mail oder Passwort');
      setMessageType('error');
      localStorage.setItem('isLoggedIn', 'false'); // Setze den Anmeldestatus auf false
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