import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuButtons from "../components/MenuButtons";
import axios from "axios";
import "./Vorstellung.css";

function Vorstellung() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID aus URL holen
  const [film, setFilm] = useState(null); // Film-Details
  const [vorstellungen, setVorstellungen] = useState([]); // Alle Vorstellungen für den Film
  const [bewertungen, setBewertungen] = useState([]); // Bewertungsdaten
  const [selectedDate, setSelectedDate] = useState(''); // Vom User gewähltes Datum
  const [showFullDescription, setShowFullDescription] = useState(false); // Beschreibung ganz anzeigen oder kürzen
  const descriptionMaxLength = 200; // Zeichenlänge für gekürzte Beschreibung

  // Film-, Vorstellungs- und Bewertungsdaten laden
  useEffect(() => {
    axios.get(`http://localhost:5000/api/filme/${id}`)
      .then(res => setFilm(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:5000/api/vorstellungen/${id}`)
      .then(res => setVorstellungen(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:5000/api/bewertungen/durchschnitt/${id}`)
      .then(res => setBewertungen(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Wenn noch keine Daten geladen sind
  if (!film || vorstellungen.length === 0) {
    return <div></div>;
  }

  // Gibt die nächsten 7 Tage mit verfügbaren Vorstellungen zurück
  const getNaechste7Tage = () => {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);

    const dates = [
      ...new Set(
        vorstellungen.map(v =>
          new Date(v.startzeit).toLocaleDateString("de-DE")
        )
      )
    ]
      .map(dateStr => {
        const [day, month, year] = dateStr.split(".");
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
        return { original: dateStr, date: dateObj };
      })
      .filter(obj => obj.date >= heute)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 7);

    return dates.map(d => d.original);
  };

  // Filtert Uhrzeiten nach gewähltem Tag
  const uhrzeitenFuerTag = selectedDate
    ? vorstellungen
        .filter(v => new Date(v.startzeit).toLocaleDateString("de-DE") === selectedDate)
        .map(v => ({
          id: v._id,
          zeit: new Date(v.startzeit).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit"
          }),
          startzeit: v.startzeit
        }))
        .sort((a, b) => new Date(a.startzeit).getTime() - new Date(b.startzeit).getTime())
    : [];

  // Prüfung, ob Zeit bereits vergangen ist
  const isTimeSlotDisabled = (startzeit) => {
    const now = new Date();
    return new Date(startzeit) < now;
  };

  // Kürzt Beschreibung, "mehr anzeigen" möglich
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
            {bewertungen.anzahl > 0 ? (
              <p>{bewertungen.durchschnitt.toFixed(1)}</p> // Bewertungen auf erste Nachkommastelle gerundet
            ) : (
              <p>0</p> // falls keine Bewertungen vorhanden
            )}
          </button>
          {/* Bewertungsanzahl, Dauer und FSK */}
          {<div className="film-info-text anzahlBewerungen">{bewertungen.anzahl} Bewertungen</div>}
          {film.dauer && <div className="film-info-text dauer">{film.dauer} Min.</div>}
          {film.fsk && <div className="film-info-text fsk">FSK {film.fsk}</div>}
        </div>
      </div>

      {/* Dropdownmenü zur Datumsauswahl */}
      <select
        className="datum-dropdown"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        {selectedDate === '' && <option value="">Datum auswählen</option>}
        {getNaechste7Tage().map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      {/* Uhrzeit-Buttons */}
      <div className="button-grid vorstellung-container">
        {uhrzeitenFuerTag.length > 0 ? (
          uhrzeitenFuerTag.map(uhr => {
            console.log("ID der Vorstellung:", uhr.startzeit); // Debug-Ausgabe der Startzeit
            return (
              <button
                key={uhr.id}
                className="uhrzeit-button"
                onClick={() => {
                  // Daten in SessionStorage speichern
                  sessionStorage.setItem("filmId", film._id);
                  sessionStorage.setItem("vorstellungsId", uhr.id);
                  sessionStorage.setItem("filmTitel", film.titel);
                  sessionStorage.setItem("datum", selectedDate);
                  sessionStorage.setItem("uhrzeit", uhr.zeit);

                  // Zur Platzwahl weiterleiten
                  navigate(`/Film/${film._id}/1/${uhr.startzeit}`);
                }}
                disabled={isTimeSlotDisabled(uhr.startzeit)} // Button deaktivieren, wenn vergangen
              >
                {uhr.zeit}
              </button>
            );
          })
        ) : (
          selectedDate && (
            <p className="no-vorstellungen-message">
              Keine Vorstellungen für dieses Datum verfügbar.
            </p>
          )
        )}
      </div>

      {/* Navigationsmenü unten */}
      <MenuButtons />
    </div>
  );
}

export default Vorstellung;
