import './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JumanjiBild from './Bilder/Jumanji.jpg';
import LiloundStitchBild from './Bilder/LiloundStitch.jpg';
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

function App() {
  const navigate = useNavigate();
  
  /* Suche */
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
  if (!searchTerm) return;

  const searchTermNormalized = searchTerm.toLowerCase().replace(/\s/g, '');

  const imageIds = [
    'jumanji',
    'liloundstitchbild',
    'thunderbolts',
    'theaccounttwo',
    'missionimpossible',
    'batman',
    'minecraft',
    'harrypotter',
    'herrderringe',
    'theamateur',
    'fastandfurious',
    'spongebob',
    'untildawn',
    'thetransporter',
    'starwars',
  ];

  const foundId = imageIds.find(id => id.includes(searchTermNormalized));

  if (foundId) {
    const element = document.getElementById(foundId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowSearch(false);
    }
  } else {
    alert('Kein Film gefunden!');
  }
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  /* Seite */
  return (
    <>
      <div className="buttonBar">
        <button
          className="suchButton"
          onClick={() => setShowSearch(prev => !prev)} /* Suchleiste anzeigen */
        >
          Suchen
        </button>
        <button
          className="ticketButton"
          onClick={() => navigate('/Tickets')} /* Navigation zu /Tickets */
        >
          Tickets
        </button>
        <button
          className="accountButton"
          onClick={() => navigate('/Account')} /* Navigation zu /Account */
        >
          Account
        </button>
      </div>

      {showSearch && (
        <div className="suchbereich">
          <input
            type="text"
            placeholder="Suchbegriff eingeben..."
            autoFocus
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>
            Los
          </button>
        </div>
      )}

      <div className="bild-galerie">
        <a id="jumanji" href="/Jumanji"><img src={JumanjiBild} alt="Jumanji" /></a>
        <a id="liloundstitch" href="/LiloundStitchBild"><img src={LiloundStitchBild} alt="LiloundStitchBild" /></a>
        <a id="thunderbolts" href="/Thunderbolts"><img src={Thunderbolts} alt="Thunderbolts" /></a>
        <a id="theaccounttwo" href="/TheAccountTwo"><img src={TheAccountTwo} alt="TheAccountTwo" /></a>
        <a id="missionimpossible" href="/MissionImpossible"><img src={MissionImpossible} alt="MissionImpossible" /></a>
        <a id="batman" href="/Batman"><img src={Batman} alt="Batman" /></a>
        <a id="minecraft" href="/Minecraft"><img src={Minecraft} alt="Minecraft" /></a>
        <a id="harrypotter" href="/HarryPotter"><img src={HarryPotter} alt="HarryPotter" /></a>
        <a id="herrderringe" href="/HerrDerRinge"><img src={HerrDerRinge} alt="HerrDerRinge" /></a>
        <a id="theamateur" href="/TheAmateur"><img src={TheAmateur} alt="TheAmateur" /></a>
        <a id="fastandfurious" href="/FastandFurious"><img src={FastandFurious} alt="FastandFurious" /></a>
        <a id="spongebob" href="/Spongebob"><img src={Spongebob} alt="Spongebob" /></a>
        <a id="untildawn" href="/UntilDawn"><img src={UntilDawn} alt="UntilDawn" /></a>
        <a id="thetransporter" href="/TheTransporter"><img src={TheTransporter} alt="TheTransporter" /></a>
        <a id="starwars" href="/StarWars"><img src={StarWars} alt="StarWars" /></a>
      </div>
    </>
  );
}

export default App;
