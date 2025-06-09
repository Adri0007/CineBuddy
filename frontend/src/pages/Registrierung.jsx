import React, { useState } from 'react';
import './Registrierung.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';

function Registrierung() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [bestaetigung, setBestaetigung] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwortError, setPasswortError] = useState('');
  const [bestaetigungError, setBestaetigungError] = useState('');

  const [globalMessage, setGlobalMessage] = useState('');
  const [globalMessageType, setGlobalMessageType] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setUsernameError('');
    setEmailError('');
    setPasswortError('');
    setBestaetigungError('');
    setGlobalMessage('');
    setGlobalMessageType('');

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      isValid = false;
    }

    if (passwort.length < 8) {
      setPasswortError('Mindestens 8 Zeichen.');
      isValid = false;
    }

    if (passwort !== bestaetigung) {
      setBestaetigungError('Passwörter stimmen nicht überein.');
      isValid = false;
    }

    if (username.trim().length === 0) {
      setUsernameError('Benutzername darf nicht leer sein.');
      isValid = false;
    }

    if (!isValid) {
      setGlobalMessage('❌ Bitte überprüfen Sie Ihre Eingaben.');
      setGlobalMessageType('error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password: passwort
      });

      setGlobalMessage('✅ Registrierung erfolgreich! Sie können sich jetzt anmelden.');
      setGlobalMessageType('success');
      setUsername('');
      setEmail('');
      setPasswort('');
      setBestaetigung('');
      setTimeout(() => {
        navigate('/Anmeldung');
      }, 1500);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setGlobalMessage(err.response.data.error);
      } else if (err.response && err.response.data && err.response.data.message) {
        setGlobalMessage(err.response.data.message);
      } else {
        setGlobalMessage('Serverfehler, bitte später versuchen.');
      }
      setGlobalMessageType('error');
    }
  };

  return (
    <div className="registrierung-container">
      <form onSubmit={handleRegister} className="registrierung-box" noValidate>
        <h2>Registrieren</h2>

        <label htmlFor="username">Benutzername</label>
        <input
          type="text"
          id="username"
          placeholder="Benutzername eingeben"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {usernameError && <div className="input-error-message">{usernameError}</div>}

        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          id="email"
          placeholder="E-Mail eingeben"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <div className="input-error-message">{emailError}</div>}

        <label htmlFor="password">Passwort</label>
        <input
          type="password"
          id="password"
          placeholder="Passwort eingeben"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          required
          minLength="8"
        />
        {passwortError && <div className="input-error-message">{passwortError}</div>}

        <label htmlFor="confirmPassword">Passwort bestätigen</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Passwort wiederholen"
          value={bestaetigung}
          onChange={(e) => setBestaetigung(e.target.value)}
          required
        />
        {bestaetigungError && <div className="input-error-message">{bestaetigungError}</div>}

        {globalMessage && <div className={`message ${globalMessageType}`}>{globalMessage}</div>}

        <button type="submit">Registrieren</button>

        <div className="login-prompt">
          Bereits ein Konto?{' '}
          <a href="/anmeldung" className="login-link">
            Jetzt anmelden
          </a>
        </div>
      </form>
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
  );
}

export default Registrierung;