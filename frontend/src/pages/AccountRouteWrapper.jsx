import { useEffect, useState } from 'react';
import axios from 'axios';
import AccountPage from './AccountPage';
import Anmeldung from './Anmeldung';

export function AccountRouteWrapper() {
  const [loading, setLoading] = useState(true);
  const [eingeloggt, setEingeloggt] = useState(false);

  useEffect(() => {
    // This endpoint should check the user's session/token to determine login status.
    // It should NOT be the login endpoint itself.
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then((res) => {
        // Assuming the backend sends { eingeloggt: true/false }
        setEingeloggt(res.data.eingeloggt);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fehler bei Login-Check:', err);
        setEingeloggt(false); // Assume not logged in on error
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Lade...</div>;

  return eingeloggt ? <AccountPage /> : <Anmeldung />;
}

export default AccountRouteWrapper;