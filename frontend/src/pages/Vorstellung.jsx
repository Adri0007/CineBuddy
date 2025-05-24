import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Vorstellung.css";

function Vorstellung() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [vorstellung, setVorstellung] = useState(null);

  useEffect(() => {
    // Hole Filmdaten
    axios.get(`http://localhost:5000/api/filme/${id}`)
      .then(res => setFilm(res.data))
      .catch(err => console.error(err));

    // Hole die Vorstellung zu diesem Film
    axios.get(`http://localhost:5000/api/vorstellungen/${id}`)
      .then(res => setVorstellung(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!film || !vorstellung) {
    return <div>Lade Daten...</div>;
  }


  return (
    <div>
      <img src={film.bild} alt={film.titel} className="vorstellung-bild" />
      <div className="text-and-rating-container">
        <div className="film-beschreibung-text">
          {film.beschreibung}
        </div>
        <p>Dauer: {film.dauer} min</p>
        <p>FSK: {film.fsk}</p>
      </div>
      <div>
        <p>
          <strong>Verfügbare Tage:</strong>{" "}
          {vorstellung.tage && vorstellung.tage.length > 0
            ? vorstellung.tage.join(", ")
            : "Keine Angabe"}
        </p>
        <p>
          <strong>Verfügbare Uhrzeiten:</strong>{" "}
          {vorstellung.uhrzeiten && vorstellung.uhrzeiten.length > 0
            ? vorstellung.uhrzeiten.join(", ")
            : "Keine Angabe"}
        </p>
      </div>
    </div>
  );
}

export default Vorstellung;
