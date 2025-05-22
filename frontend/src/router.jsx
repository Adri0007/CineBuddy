import { Routes, Route } from 'react-router-dom';


import Startseite from './pages/Startseite.jsx';
import { VorstellungJumanji, VorstellungBatman, VorstellungLiloundStitch, VorstellungThunderbolts, 
          VorstellungTheAccountTwo, VorstellungMissionImpossible, VorstellungMinecraft,
          VorstellungHarryPotter, VorstellungHerrDerRinge, VorstellungTheAmateur,
          VorstellungFastandFurious, VorstellungSpongebob, VorstellungUntilDawn,
          VorstellungTheTransporter, VorstellungStarWars
} from "./pages/Vorstellung.jsx";


// Dummy-Komponenten für noch nicht vorhandene Seiten (Platzhalter)

const Tickets = () => <div>Tickets Seite noch nicht verfügbar</div>;
const Account = () => <div>Account Seite noch nicht verfügbar</div>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/Jumanji" element={<VorstellungJumanji  />} />
      <Route path="/LiloundStitch" element={<VorstellungLiloundStitch />} />
      <Route path="/Thunderbolts" element={<VorstellungThunderbolts />} />
      <Route path="/TheAccountTwo" element={<VorstellungTheAccountTwo />} />
      <Route path="/MissionImpossible" element={<VorstellungMissionImpossible />} />
      <Route path="/Batman" element={<VorstellungBatman  />} />
      <Route path="/Minecraft" element={<VorstellungMinecraft />} />
      <Route path="/HarryPotter" element={<VorstellungHarryPotter />} />
      <Route path="/HerrDerRinge" element={<VorstellungHerrDerRinge />} />
      <Route path="/TheAmateur" element={<VorstellungTheAmateur />} />
      <Route path="/FastandFurious" element={<VorstellungFastandFurious />} />
      <Route path="/Spongebob" element={<VorstellungSpongebob />} />
      <Route path="/UntilDawn" element={<VorstellungUntilDawn />} />
      <Route path="/TheTransporter" element={<VorstellungTheTransporter />} />
      <Route path="/StarWars" element={<VorstellungStarWars />} />
      <Route path="/Account" element={<Account />} />

      
    </Routes>
  );
}

