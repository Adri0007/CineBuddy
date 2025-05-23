import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Vorstellung.css";


function Vorstellung() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/filme/${id}`)
      .then(res => setFilm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!film) return <div>Keine Verbindung zum Backend</div>;

  return (
    <div>
      <img src={film.bild} alt={film.titel} className="vorstellung-bild" />
      <div className="vorstellung-text">
        <h2>{film.titel}</h2>
        <p>{film.beschreibung}</p>
        <p>Dauer: {film.dauer} min</p>
        <p>FSK: {film.fsk}</p>
      </div>
    </div>
  );
}

export default Vorstellung;
