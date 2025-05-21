import './App.css';
import JumanjiBild from './Bilder/Jumanji.jpg';
import liloundStichBild from './Bilder/LiloundStich.jpg';
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

class Film {
  #id;
  #title;
  #dauer;
  #fsk;
  #beschreibung;
  #vorschaubild;

  constructor(id, title, dauer, fsk, beschreibung, vorschaubild) {
    this.#id = id;
    this.#title = title;
    this.#dauer = dauer;
    this.#fsk = fsk;
    this.#beschreibung = beschreibung;
    this.#vorschaubild = vorschaubild;
  }

  get id() {
    return this.#id;
  }
  set id(neueId) {
    this.#id = neueId;
  }

  get title() {
    return this.#title;
  }
  set title(neueTitle) {
    this.#title = neueTitle;
  }

  get dauer() {
    return this.#dauer;
  }
  set dauer(neueDauer) {
    this.#dauer = neueDauer;
  }

  get fsk() {
    return this.#fsk;
  }
  set fsk(neueFsk) {
    this.#fsk = neueFsk;
  }

  get beschreibung() {
    return this.#beschreibung;
  }
  set beschreibung(neueBeschreibung) {
    this.#beschreibung = neueBeschreibung;
  }

  get vorschaubild() {
    return this.#vorschaubild;
  }
  set vorschaubild(neuevorschaubild) {
    this.#vorschaubild = neuevorschaubild;
  }
}

function HomeButton() {
  return (
    <button>
      Home
    </button>
  );
}


function App() {
  const Jumanji = new Film(1, "Jumanji", 119, 12, "Vier Teenager werden beim Spielen eines Videospiels in eine Dschungelwelt transportiert. Statt mit Hausaufgaben und Nachsitzen haben sie es jetzt mit schwarzen Mambas und anderen Dschungelfallen zu tun. Auch ihre Körper haben sich verändert: so ist aus dem bescheidenen Spencer ein richtiger Abenteurer geworden, und die Außenseiterin Martha trägt jetzt den Titel Ruby Roundhouse. Nur gemeinsam können sie entkommen.",
    JumanjiBild
  );

  return (
    <>
      <a href="/Jumanji">
        <img src={Jumanji.vorschaubild} alt={Jumanji.title} />
      </a>
      <HomeButton />
    </>
  );
}

export default App;
