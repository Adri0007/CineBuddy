import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';

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
        const email = localStorage.getItem('userEmail');
        if (!email) {
          // Keine E-Mail gespeichert → ausloggen
          handleLogout();
          return;
        }

        // Backend-API call
        const response = await fetch(
          `http://localhost:5000/api/user-data?email=${encodeURIComponent(email)}`
        );
        if (!response.ok) throw new Error('Fehler beim Laden der Daten');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        handleLogout();
      }
    };

    fetchUserData();
    // eslint-disable-next-line
  }, []); // Nur beim Mounten

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

        <div className="account-actions-section">
          <button onClick={handleLogout} className="logout-button">
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
