import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "./Vorstellung.css";

function Vorstellung() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [vorstellungen, setVorstellungen] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const descriptionMaxLength = 200;

  
  useEffect(() => {
    axios.get(`http://localhost:5000/api/filme/${id}`)
      .then(res => setFilm(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:5000/api/vorstellungen/${id}`)
      .then(res => setVorstellungen(res.data)) 
      .catch(err => console.error(err));
  }, [id]);


  if (!film || vorstellungen.length === 0) {
    return <div>Keine Verbindung zum Backend</div>;
  }

 
  const tage = [
    ...new Set(
      vorstellungen.map(v =>
        new Date(v.startzeit).toLocaleDateString("de-DE")
      )
    )
  ];

 
  const uhrzeitenFuerTag = selectedTag
    ? vorstellungen
        .filter(v => new Date(v.startzeit).toLocaleDateString("de-DE") === selectedTag)
        .map(v => ({
          id: v._id,
          zeit: new Date(v.startzeit).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
        }))
    : [];

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

      
      <select
        className="datum-dropdown"
        value={selectedTag}
        onChange={e => setSelectedTag(e.target.value)}
      >
        <option value="">Datum auswählen</option>
        {tage.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

     
      <div className="button-grid vorstellung-container">
        {uhrzeitenFuerTag.map(uhr => (
          <button
            key={uhr.id}
            className="uhrzeit-button"
            onClick={() => navigate(`/Film/${film._id}/vorstellung/${uhr.id}`)}
          >
            {uhr.zeit}
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
