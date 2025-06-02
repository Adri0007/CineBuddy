import React, { useState } from 'react';
import './Registrierung.css';
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate

function Registrierung() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [bestaetigung, setBestaetigung] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwortError, setPasswortError] = useState('');
  const [bestaetigungError, setBestaetigungError] = useState('');

  const [globalMessage, setGlobalMessage] = useState('');
  const [globalMessageType, setGlobalMessageType] = useState('');
  const navigate = useNavigate(); // Hook für die Navigation

  const handleRegister = (e) => {
    e.preventDefault(); // Verhindert das Standard-Neu-Laden der Seite

    // Alle Fehlermeldungen und globale Nachrichten zurücksetzen
    setNameError('');
    setEmailError('');
    setPasswortError('');
    setBestaetigungError('');
    setGlobalMessage('');
    setGlobalMessageType('');

    let isValid = true;

    // --- Validierungen ---

    // 1. E-Mail-Validierung
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein.'); // Fehlermeldung für E-Mail gesetzt
      isValid = false;
    }

    // 2. Passwort-Längenvalidierung
    if (passwort.length < 8) {
      setPasswortError('Mindestens 8 Zeichen.');
      isValid = false;
    }

    // 3. Passwort-Bestätigung
    if (passwort !== bestaetigung) {
      setBestaetigungError('Passwörter stimmen nicht überein.');
      isValid = false;
    }

    // Optional: Benutzername-Validierung (z.B. nicht leer)
    if (name.trim().length === 0) {
      setNameError('Benutzername darf nicht leer sein.');
      isValid = false;
    }

    // Wenn NICHT alle Validierungen erfolgreich waren, hier beenden
    if (!isValid) {
      setGlobalMessage('❌ Bitte überprüfen Sie Ihre Eingaben.');
      setGlobalMessageType('error');
      return;
    }

    // --- Wenn alle Validierungen erfolgreich sind ---
    console.log("Registrierung gesendet:", { name, email, passwort });

    // HIER WÜRDE DEIN ECHTER API-CALL STEHEN
    // Nach erfolgreicher Registrierung (und ggf. sofortiger Anmeldung)
    // localStorage.setItem('isLoggedIn', 'true'); // Setze den Anmeldestatus, falls du dich sofort anmeldest

    // Demo-Nachricht für erfolgreiche Validierung
    setGlobalMessage('✅ Registrierung erfolgreich! Sie können sich jetzt anmelden.');
    setGlobalMessageType('success');
    setName('');
    setEmail('');
    setPasswort('');
    setBestaetigung('');
    setTimeout(() => {
        navigate('/Anmeldung'); // Leite zur Anmeldeseite weiter
    }, 1500); // Kurze Verzögerung
  };

  return (
    <div className="registrierung-container">
      {/* Hinzugefügt: noValidate Attribut zum Formular */}
      <form onSubmit={handleRegister} className="registrierung-box" noValidate>
        <h2>Registrieren</h2>

        {/* Benutzername */}
        <label htmlFor="username">Benutzername</label>
        <input
          type="text"
          id="username"
          placeholder="Benutzername eingeben"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {nameError && <div className="input-error-message">{nameError}</div>}

        {/* E-Mail */}
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

        {/* Passwort */}
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

        {/* Passwort bestätigen */}
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

        {/* Globale Rückmeldung anzeigen */}
        {globalMessage && <div className={`message ${globalMessageType}`}>{globalMessage}</div>}

        {/* Registrieren Button */}
        <button type="submit">Registrieren</button>

        {/* Link zur Anmeldeseite */}
        <div className="login-prompt">
          Bereits ein Konto?{' '}
          <a href="/anmeldung" className="login-link">
            Jetzt anmelden
          </a>
        </div>
      </form>
    </div>
  );
}

export default Registrierung;
