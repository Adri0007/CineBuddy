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
    <div class = "bild-galerie">
      <a href="/Jumanji">
        <img src={JumanjiBild} alt="Jumanji" />
      </a>
      <a href="/LiloundStichBild">
        <img src={LiloundStichBild} alt="LiloundStichBild" />
      </a>
      <a href="/Thunderbolts">
        <img src={Thunderbolts} alt="Thunderbolts" />
      </a>
      <a href="/TheAccountTwo">
        <img src={TheAccountTwo} alt="TheAccountTwo" />
      </a>
      <a href="/MissionImpossible">
        <img src={MissionImpossible} alt="MissionImpossible" />
      </a>
      <a href="/Batman">
        <img src={Batman} alt="Batman" />
      </a>
      <a href="/Minecraft">
        <img src={Minecraft} alt="Minecraft" />
      </a>
      <a href="/HarryPotter">
        <img src={HarryPotter} alt="HarryPotter" />
      </a>
      <a href="/HerrDerRinge">
        <img src={HerrDerRinge} alt="HerrDerRinge" />
      </a>
      <a href="/TheAmateur">
        <img src={TheAmateur} alt="TheAmateur" />
      </a>
      <a href="/FastandFurious">
        <img src={FastandFurious} alt="FastandFurious" />
      </a>
      <a href="/Spongebob">
        <img src={Spongebob} alt="Spongebob" />
      </a>
      <a href="/UntilDawn">
        <img src={UntilDawn} alt="UntilDawn" />
      </a>
      <a href="/TheTransporter">
        <img src={TheTransporter} alt="TheTransporter" />
      </a>
      <a href="/StarWars">
        <img src={StarWars} alt="StarWars" />
      </a>
      <HomeButton />
    </div>
  );
}

export default App;