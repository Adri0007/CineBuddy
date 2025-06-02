import { Routes, Route } from 'react-router-dom';

import Startseite from './pages/Startseite.jsx';
import Vorstellung from "./pages/Vorstellung.jsx";
import AccountRouteWrapper from './pages/AccountRouteWrapper'; // Behält den Wrapper
import Registrierung from './pages/Registrierung.jsx';
import Anmeldung from './pages/Anmeldung.jsx';
import AccountPage from './pages/AccountPage.jsx'; // Importiere die neue AccountPage

// Dummy-Komponenten für noch nicht vorhandene Seiten (Platzhalter)
const Tickets = () => <div>Tickets Seite noch nicht verfügbar</div>;


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/film/:id" element={<Vorstellung />} />
      
      <Route path="/Tickets" element={<Tickets />} />
      {/* Die /Account Route nutzt jetzt den Wrapper, der die Logik für die Weiterleitung enthält */}
      <Route path="/Account" element={<AccountRouteWrapper />} /> 
      <Route path="/Registrieren" element={<Registrierung />} />
      <Route path="/Anmeldung" element={<Anmeldung />} />
      {/* Optional: Wenn du AccountPage direkt ansteuern willst ohne Wrapper:
      <Route path="/meinkonto" element={<AccountPage />} />
      */}
    </Routes>
  );
}
