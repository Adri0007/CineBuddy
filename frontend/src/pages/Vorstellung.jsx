import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  const [selectedDate, setSelectedDate] = useState('');
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
    setSelectedDate(e.target.value);
  };

  const getNaechste7Tage = (tage) => {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);

    const zukunftstage = tage
      .map(tag => {
        const [tagStr, monatStr, jahrStr] = tag.split("-");
        const dateObj = new Date(parseInt(jahrStr), parseInt(monatStr) - 1, parseInt(tagStr));
        dateObj.setHours(0, 0, 0, 0);

        return {
          original: tag,
          date: dateObj
        };
      })
      .filter(obj => obj.date >= heute)
      .sort((a, b) => a.date - b.date)
      .slice(0, 7);

    return zukunftstage.map(obj => obj.original);
  };

  const isTimeSlotDisabled = (uhrzeit) => {
    if (!selectedDate) {
      return true; // Deaktiviert, wenn kein Datum ausgewählt ist
    }

    const [day, month, year] = selectedDate.split("-").map(Number);
    const [hour, minute] = uhrzeit.split(":").map(Number);

    // Erstelle ein Date-Objekt für die spezifische Vorstellung
    const vorstellungsDateTime = new Date(year, month - 1, day, hour, minute);

    const now = new Date(); // Aktuelle Zeit

    // Überprüfe, ob die Vorstellung in der Vergangenheit liegt
    return vorstellungsDateTime <= now;
  };


  const displayedDescription =
    film.beschreibung.length > descriptionMaxLength && !showFullDescription
      ? film.beschreibung.substring(0, descriptionMaxLength) + "..."
      : film.beschreibung;

  const availableDates = vorstellung.tage ? getNaechste7Tage(vorstellung.tage) : [];

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

      <select className="datum-dropdown" onChange={datumChange} value={selectedDate}>
        {!selectedDate && <option value="">Datum auswählen</option>}
        {availableDates.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <div className="button-grid vorstellung-container">
        {vorstellung.uhrzeiten.map((uhrzeit, index) => (
          <button
            key={index}
            className="uhrzeit-button"
            onClick={() => navigate(`/Film/${film._id}/${index}`)}
            disabled={isTimeSlotDisabled(uhrzeit)} // Hier wird die neue Funktion verwendet
          >
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