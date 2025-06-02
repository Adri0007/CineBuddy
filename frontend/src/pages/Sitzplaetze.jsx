import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

import './Sitzplaetze.css';

function Sitzplaetze() {
  const { id, index, date, time } = useParams();
  const [filme, setFilme] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/filme")
      .then((res) => setFilme(res.data))
      .catch((err) => console.error("Fehler beim Laden der Filme:", err));
  }, []);

  const film = filme.find((f) => f.id === id || f._id === id);

  const handleClick = (index) => {
    if (selectedSeats.includes(index)) {
      setSelectedSeats(selectedSeats.filter(i => i !== index));
    } else {
      setSelectedSeats([...selectedSeats, index]);
    }
  };

  return (
    <div className="bodySitzplaetze">
      <h1>
        {film ? film.name || film.titel || film.id : "wird geladen..."} {date} {time}
      </h1>
      <div className="Filmwand">
        <p className="LeinwandText">Leinwand</p>
      </div>
      <div className="Bereich">
        {Array.from({ length: 20 }).map((_, i) => (
          <button
            key={i}
            className={`Sitze ${selectedSeats.includes(i) ? "selected" : ""}`}
            onClick={() => handleClick(i)}
          >
            <FontAwesomeIcon icon={faCouch} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sitzplaetze;
