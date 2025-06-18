import React, { useEffect, useState } from 'react';
import AccountPage from './AccountPage';
import Anmeldung from './Anmeldung';
import { useNavigate } from 'react-router-dom';

export default function AccountRouteWrapper() {
  const [loading, setLoading] = useState(true); // Ladeanzeige steuern
  const [eingeloggt, setEingeloggt] = useState(false); // Login-Status speichern
  const navigate = useNavigate(); // Für Weiterleitung bei nicht eingeloggt

  useEffect(() => {
    // Funktion zum Prüfen des Login-Status aus dem localStorage
    const checkLoginStatus = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
          resolve(isLoggedIn);
        }, ); 
      });
    };

    // Login-Status prüfen und entsprechend weiterleiten oder anzeigen
    checkLoginStatus().then((status) => {
      setEingeloggt(status);
      setLoading(false);
      if (!status) {
        navigate('/Anmeldung'); // Bei nicht eingeloggtem Status zur Anmeldung
      }
    });
  }, [navigate]);

  // Solange geprüft wird, Ladeanzeige anzeigen
  if (loading) {
    return (
      <div className="login-container" style={{ color: '#f8e8d6', fontSize: '1.5rem' }}>
        Lade Account-Informationen...
      </div>
    );
  }

  // Wenn eingeloggt, Account-Seite zeigen, sonst Anmeldeseite
  return eingeloggt ? <AccountPage /> : <Anmeldung />;
}
