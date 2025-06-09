import { Routes, Route } from 'react-router-dom';

import Startseite from './pages/Startseite.jsx';
import Vorstellung from "./pages/Vorstellung.jsx";
import Sitzplaetze from "./pages/Sitzplaetze.jsx";
import AccountRouteWrapper from './pages/AccountRouteWrapper';
import Registrierung from './pages/Registrierung.jsx';
import Anmeldung from './pages/Anmeldung.jsx';
import AccountPage from './pages/AccountPage.jsx';

// Dummy-Komponenten für noch nicht vorhandene Seiten (Platzhalter)
const Tickets = () => <div>Tickets Seite noch nicht verfügbar</div>;


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/Film/:id" element={<Vorstellung />} />
      <Route path="/Account" element={<AccountRouteWrapper />} />
      <Route path="/Tickets" element={<Tickets />} />
      <Route path="/Film/:id/:index/:date" element={<Sitzplaetze />} />
      <Route path="/film/:id" element={<Vorstellung />} />
      <Route path="/Registrieren" element={<Registrierung />} />
      <Route path="/Anmeldung" element={<Anmeldung />} />
    </Routes>
  );
}