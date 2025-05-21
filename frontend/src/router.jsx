import { Routes, Route } from 'react-router-dom';

// Nur Startseite importieren (vorerst)
import Startseite from './pages/Startseite.jsx';

// Dummy-Komponenten für noch nicht vorhandene Seiten (Platzhalter)
const Jumanji = () => <div>Jumanji Seite noch nicht verfügbar</div>;
const LiloundStitch = () => <div>Lilo und Stitch Seite noch nicht verfügbar</div>;
const Thunderbolts = () => <div>Thunderbolts Seite noch nicht verfügbar</div>;
const TheAccountTwo = () => <div>TheAccountTwo Seite noch nicht verfügbar</div>;
const MissionImpossible = () => <div>MissionImpossible Seite noch nicht verfügbar</div>;
const Batman = () => <div>LBatman Seite noch nicht verfügbar</div>;
const Minecraft = () => <div>Minecraft Seite noch nicht verfügbar</div>;
const HarryPotter = () => <div>HarryPotter Seite noch nicht verfügbar</div>;
const HerrDerRinge = () => <div>HerrDerRinge Seite noch nicht verfügbar</div>;
const TheAmateur = () => <div>TheAmateur Seite noch nicht verfügbar</div>;
const FastandFurious = () => <div>FastandFurious Seite noch nicht verfügbar</div>;
const Spongebob = () => <div>Spongebob Seite noch nicht verfügbar</div>;
const UntilDawn = () => <div>UntilDawn Seite noch nicht verfügbar</div>;
const TheTransporter = () => <div>TheTransporter Seite noch nicht verfügbar</div>;
const StarWars = () => <div>StarWars Seite noch nicht verfügbar</div>;
const Tickets = () => <div>Tickets Seite noch nicht verfügbar</div>;
const Account = () => <div>Account Seite noch nicht verfügbar</div>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/Jumanji" element={<Jumanji />} />
      <Route path="/LiloundStitch" element={<LiloundStitch />} />
      <Route path="/Thunderbolts" element={<Thunderbolts />} />
      <Route path="/TheAccountTwo" element={<TheAccountTwo />} />
      <Route path="/MissionImpossible" element={<MissionImpossible />} />
      <Route path="/Batman" element={<Batman />} />
      <Route path="/Minecraft" element={<Minecraft />} />
      <Route path="/HarryPotter" element={<HarryPotter />} />
      <Route path="/HerrDerRinge" element={<HerrDerRinge />} />
      <Route path="/TheAmateur" element={<TheAmateur />} />
      <Route path="/FastandFurious" element={<FastandFurious />} />
      <Route path="/Spongebob" element={<Spongebob />} />
      <Route path="/UntilDawn" element={<UntilDawn />} />
      <Route path="/TheTransporter" element={<TheTransporter />} />
      <Route path="/Tickets" element={<Tickets />} />
      <Route path="/Account" element={<Account />} />

      
    </Routes>
  );
}

