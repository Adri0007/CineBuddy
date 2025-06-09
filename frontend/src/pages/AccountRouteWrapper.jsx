import React, { useEffect, useState } from 'react';
import AccountPage from './AccountPage';
import Anmeldung from './Anmeldung';
import { useNavigate } from 'react-router-dom';

export default function AccountRouteWrapper() {
  const [loading, setLoading] = useState(true);
  const [eingeloggt, setEingeloggt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const checkLoginStatus = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
          resolve(isLoggedIn);
        }, 500);
      });
    };

    checkLoginStatus().then((status) => {
      setEingeloggt(status);
      setLoading(false);
      if (!status) {
        navigate('/Anmeldung');
      }
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className="login-container" style={{ color: '#f8e8d6', fontSize: '1.5rem' }}>
        Lade Account-Informationen...
      </div>
    );
  }

  return eingeloggt ? <AccountPage /> : <Anmeldung />;
}