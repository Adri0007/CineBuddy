import './App.css';
import JumanjiBild from './Bilder/Jumanji.jpg';
import LiloundStichBild from './Bilder/LiloundStich.jpg';
import Thunderbolts from './Bilder/Thunderbolts.jpg';
import TheAccountTwo from './Bilder/TheAccountTwo.jpg';
import MissionImpossible from './Bilder/MissionImpossible.jpg';
import Batman from './Bilder/Batman.jpg';
import Minecraft from './Bilder/Minecraft.jpg';
import HarryPotter from './Bilder/HarryPotter.jpg';
import HerrDerRinge from './Bilder/HerrDerRinge.jpg';
import TheAmateur from './Bilder/TheAmateur.jpg';
import FastandFurious from './Bilder/FastandFurious.jpg';
import Spongebob from './Bilder/Spongebob.jpg';
import UntilDawn from './Bilder/UntilDawn.jpg';
import TheTransporter from './Bilder/TheTransporter.jpg';
import StarWars from './Bilder/StarWars.png';

function HomeButton() {
  return (
    <button>
      Home
    </button>
  );
}

function App() {

  return (
    <>
      <a href="/Jumanji">
        <img src={JumanjiBild} alt="Jumanji" />
      </a>
      <HomeButton />
    </>
  );
}

export default App;