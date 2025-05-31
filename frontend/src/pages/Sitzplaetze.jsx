import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import './Sitzplaetze.css';

function Sitzplaetze() {
  const { id, index, date, time } = useParams();
  const [filme, setFilme] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/filme")
      .then((res) => setFilme(res.data))
      .catch((err) => console.error("Fehler beim Laden der Filme:", err));
  }, []);

  // 🎯 richtigen Film aus Liste finden
  const film = filme.find((f) => f.id === id || f._id === id);
  

  return (
    <div className="bodySitzplaetze">
      <h1>
        {" "}
        {film ? film.name || film.titel || film.id : "wird geladen..."} {date} {time}
      </h1>
      <div className="Bereich">
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
            <button className="Sitze"></button>
      </div>
    </div>
  );
}

export default Sitzplaetze;
