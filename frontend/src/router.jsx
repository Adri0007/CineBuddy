import { Routes, Route } from 'react-router-dom';

import Startseite from './pages/Startseite.jsx';
import Vorstellung from "./pages/Vorstellung.jsx";
import Sitzplaetze from "./pages/Sitzplaetze.jsx";

// Dummy-Komponenten für noch nicht vorhandene Seiten (Platzhalter)
const Tickets = () => <div>Tickets Seite noch nicht verfügbar</div>;
const Account = () => <div>Account Seite noch nicht verfügbar</div>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/Film/:id" element={<Vorstellung />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/Tickets" element={<Tickets />} />

      <Route path="/Film/:id/:index/:date/:time" element={<Sitzplaetze />} />
    </Routes>
  );
}

