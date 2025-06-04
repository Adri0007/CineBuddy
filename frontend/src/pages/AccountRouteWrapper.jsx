import React, { useEffect, useState } from 'react';
import AccountPage from './AccountPage'; // Die Seite, die angezeigt wird, wenn der Benutzer angemeldet ist
import Anmeldung from './Anmeldung';     // Die Anmeldeseite, falls der Benutzer nicht angemeldet ist
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate für die Navigation

export default function AccountRouteWrapper() {
  const [loading, setLoading] = useState(true);
  const [eingeloggt, setEingeloggt] = useState(false);
  const navigate = useNavigate(); // Hook für die Navigation

  useEffect(() => {
    // Simuliere einen API-Aufruf, um den Anmeldestatus zu überprüfen
    // In einer echten Anwendung würdest du hier einen Fetch- oder Axios-Aufruf zu deinem Backend machen
    // Beispiel: axios.get('/api/check-session', { withCredentials: true })
    const checkLoginStatus = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Hier simulierst du, ob der Benutzer angemeldet ist
          // In einer echten App würdest du dies basierend auf einer Session-ID, einem Token oder Backend-Antwort tun
          const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Beispiel: Status im localStorage speichern
          resolve(isLoggedIn);
        }, 500); // Simuliere eine Netzwerkverzögerung
      });
    };

    checkLoginStatus().then((status) => {
      setEingeloggt(status);
      setLoading(false);
      // Wenn der Benutzer nicht eingeloggt ist, leite ihn zur Anmeldeseite weiter
      if (!status) {
        navigate('/Anmeldung');
      }
    });
  }, [navigate]); // Füge navigate zu den Abhängigkeiten hinzu

  if (loading) {
    return (
      <div className="login-container" style={{ color: '#f8e8d6', fontSize: '1.5rem' }}>
        Lade Account-Informationen...
      </div>
    );
  }

  // Wenn eingeloggt, zeige die AccountPage, sonst die Anmeldung (obwohl wir schon weitergeleitet haben)
  // Dies ist eine Fallback-Logik, falls die Navigation aus irgendeinem Grund fehlschlägt oder verzögert ist.
  return eingeloggt ? <AccountPage /> : <Anmeldung />;
}