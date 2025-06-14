import { Routes, Route } from 'react-router-dom';

import Startseite from './pages/Startseite.jsx';
import Vorstellung from "./pages/Vorstellung.jsx";
import Sitzplaetze from "./pages/Sitzplaetze.jsx";
import AccountRouteWrapper from './pages/AccountRouteWrapper';
import Registrierung from './pages/Registrierung.jsx';
import Anmeldung from './pages/Anmeldung.jsx';
import Ticketseite from './pages/TicketPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import Buchungsseite from './pages/Buchungsseite.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/Film/:id" element={<Vorstellung />} />
      <Route path="/Account" element={<AccountRouteWrapper />} />
      <Route path="/Tickets" element={<Ticketseite />} />
      <Route path="/Film/:id/:index/:date" element={<Sitzplaetze />} />
      <Route path="/film/:id" element={<Vorstellung />} />
      <Route path="/Registrieren" element={<Registrierung />} />
      <Route path="/Anmeldung" element={<Anmeldung />} />
      <Route path="/Buchungsseite" element={<Buchungsseite />} />
    </Routes>
  );
}
