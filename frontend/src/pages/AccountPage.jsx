import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css'; // Importiere die neue CSS-Datei
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';

function AccountPage() {
  const navigate = useNavigate();
  // Verwende State, um Benutzerdaten zu speichern.
  // In einer echten App würden diese Daten von deinem Backend geladen.
  const [userData, setUserData] = useState({
    username: 'MaxMustermann', // Platzhalter
    email: 'max.mustermann@example.com', // Platzhalter
  });

  useEffect(() => {
    // Hier würdest du normalerweise einen API-Aufruf machen,
    // um die tatsächlichen Benutzerdaten vom Backend zu laden.
    // Beispiel:
    // const fetchUserData = async () => {
    //   try {
    //     const response = await fetch('/api/user-data'); // Dein API-Endpunkt
    //     const data = await response.json();
    //     setUserData(data);
    //   } catch (error) {
    //     console.error('Fehler beim Laden der Benutzerdaten:', error);
    //     // Optional: Benutzer abmelden oder Fehlermeldung anzeigen
    //     handleLogout();
    //   }
    // };
    // fetchUserData();

    // Für die Demo verwenden wir simulierte Daten
    const simulatedUserData = {
      username: 'FilmFan2025',
      email: 'filmfan@kino.com',
    };
    setUserData(simulatedUserData);

  }, []); // Leeres Array bedeutet, dass dieser Effekt nur einmal beim Mounten ausgeführt wird


  // Funktion zum Abmelden
  const handleLogout = () => {
    // Simuliere das Entfernen des Anmeldestatus
    localStorage.removeItem('isLoggedIn'); // Entferne den Status aus dem localStorage
    // In einer echten Anwendung würdest du hier einen API-Call zum Abmelden machen
    // Beispiel: axios.post('/api/logout').then(() => navigate('/Anmeldung'));
    navigate('/Anmeldung'); // Leite zur Anmeldeseite weiter
  };

  return (
    <div className="account-container">
      <div className="account-box">
        <h2 className="account-title">Mein Account</h2>

        <div className="account-info-section">
          <h3>Profilinformationen</h3>
          <div className="info-item">
            <label>Benutzername:</label>
            <span>{userData.username}</span>
          </div>
          <div className="info-item">
            <label>E-Mail:</label>
            <span>{userData.email}</span>
          </div>
          {/* Das "Mitglied seit"-Feld wurde entfernt */}
        </div>

        {/* Optional: Hier könnten weitere Sektionen folgen, z.B. Einstellungen, Bestellungen */}
        <div className="account-actions-section">
          <button onClick={handleLogout} className="logout-button">
            Abmelden
          </button>
        </div>
      </div>
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

export default AccountPage;