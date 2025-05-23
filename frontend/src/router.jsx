import { Routes, Route } from 'react-router-dom';


import Startseite from './pages/Startseite.jsx';
import Vorstellung from "./pages/Vorstellung.jsx";



// Dummy-Komponenten für noch nicht vorhandene Seiten (Platzhalter)

const Tickets = () => <div>Tickets Seite noch nicht verfügbar</div>;
const Account = () => <div>Account Seite noch nicht verfügbar</div>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/film/:id" element={<Vorstellung />} />
      <Route path="/Account" element={<Account />} />
    </Routes>
  );
}

