import React, { useState } from 'react';
import './Anmeldung.css';
import { useNavigate } from 'react-router-dom';
import MenuButtons from "../components/MenuButtons";
import axios from 'axios';


function Anmeldung() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (response.data.success) {
        setMessage('✅ Anmeldung erfolgreich!');
        setMessageType('success');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);

        setTimeout(() => {
          navigate('/Account');
        }, 1000);
      } else {
        setMessage(`❌ ${response.data.message}`);
        setMessageType('error');
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userEmail');
      }
    } catch (error) {
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
      <MenuButtons />
    </div>

  );
}

export default Anmeldung;