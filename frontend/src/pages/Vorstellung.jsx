import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "./Vorstellung.css";

function Vorstellung() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [vorstellung, setVorstellung] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionMaxLength = 200;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/filme/${id}`)
      .then(res => setFilm(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:5000/api/vorstellungen/${id}`)
      .then(res => setVorstellung(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!film || !vorstellung) {
    return <div>Keine Verbindung zum Backend</div>;
  }

  const datumChange = (e) => {
    console.log("Datum geändert:", e.target.value);
  };

  const displayedDescription =
    film.beschreibung.length > descriptionMaxLength && !showFullDescription
      ? film.beschreibung.substring(0, descriptionMaxLength) + "..."
      : film.beschreibung;

  return (
    <div className="bodyVorstellung">
      <img src={film.bild} alt={film.titel} className="vorstellung-bild" />

      <div className="text-and-rating-container">
        <p className="film-beschreibung-text">
          {displayedDescription}
          {film.beschreibung.length > descriptionMaxLength && (
            <span
              className="read-more-toggle"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? " Weniger anzeigen" : " Mehr anzeigen"}
            </span>
          )}
        </p>
        <div className="right-sidebar-content button-container">
          <button
            className="bewertung-button"
            onClick={() => navigate(`/Film/${film._id}/Bewertungen`)}
          >
            4,5
          </button>
          {film.dauer && <div className="film-info-text dauer">{film.dauer} Min.</div>}
          {film.fsk && <div className="film-info-text fsk">FSK {film.fsk}</div>}
        </div>
      </div>

      <select className="datum-dropdown" onChange={datumChange}>
        <option value="">Datum auswählen</option>
        {vorstellung.tage
          .filter((tag) => {
            const [day, month, year] = tag.split("-").map(Number);
            const tagDate = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const in7Days = new Date(today);
            in7Days.setDate(today.getDate() + 6);
            return tagDate >= today && tagDate <= in7Days;
          })
          .map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
      </select>
      <div className="button-grid vorstellung-container">
        {vorstellung.uhrzeiten.map((uhrzeit, index) => (
          <button
            key={index}
            className="uhrzeit-button" onClick={() => navigate(`/Film/${film._id}/${index}`)}>
            {uhrzeit}
          </button>
        ))}
      </div>
      <div>
        <button className="suchButton" onClick={() => navigate('/')}>
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="ticketButton" onClick={() => navigate('/Tickets')}>
          <FontAwesomeIcon icon={faTicket} />
        </button>
        <button className="accountButton" onClick={() => navigate('/Account')}>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </div>
  );
}

export default Vorstellung;
