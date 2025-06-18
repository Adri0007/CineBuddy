import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css'; 
import MenuButtons from "../components/MenuButtons";

function AccountPage() {
  const navigate = useNavigate();

  // State für Benutzerdaten
  const [userData, setUserData] = useState({
    username: '',
    email: ''
  });

  // Lade Benutzerdaten aus dem Backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail'); // E-Mail aus localStorage holen
        if (!email) {
          handleLogout(); // Falls keine E-Mail vorhanden, abmelden
          return;
        }

        // API-Aufruf zur Benutzerabfrage
        const response = await fetch(
          `http://localhost:5000/api/user-data?email=${encodeURIComponent(email)}`
        );
        if (!response.ok) throw new Error('Fehler beim Laden der Daten'); // Fehler bei nicht erfolgreicher Antwort

        const data = await response.json(); // JSON-Daten extrahieren
        setUserData(data); // Benutzer-Daten in State speichern
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error); // Fehlerausgabe in Konsole
        handleLogout(); // Bei Fehler automatisch abmelden
      }
    };

    fetchUserData(); // Funktion ausführen
  }, []);

  // Funktion zum Abmelden
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('userEmail'); 
    navigate('/Anmeldung'); 
  };

  return (
    <div className="account-container">
      <div className="account-box">
        <h2 className="account-title">Mein Account</h2>

        {/* Bereich für Benutzerinformationen */}
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
        </div>

        {/* Abmelden Button */}
        <div className="account-actions-section">
          <button onClick={handleLogout} className="logout-button">
            Abmelden
          </button>
        </div>
      </div>

      {/* Navigationsbuttons */}
      <MenuButtons />
    </div>
  );
}

export default AccountPage;
