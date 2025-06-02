import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

import './Sitzplaetze.css';

function Sitzplaetze() {
  const { id, date, time } = useParams();

  const [film, setFilm] = useState(null);
  const [saal, setSaal] = useState(null);
  const [aktuelleVorstellung, setAktuelleVorstellung] = useState(null);
  const [vorstellungssitze, setVorstellungssitze] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Film laden
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    axios.get("http://localhost:5000/api/filme")
      .then(res => {
        if (!isMounted) return;
        const gefunden = res.data.find(f => f._id === id || f.id === id);
        setFilm(gefunden || null);
      })
      .catch(err => console.error("Fehler beim Laden der Filme:", err));

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Helfer: Datum und Zeit in ISO-String mit UTC (Z) umwandeln
  const convertToDate = (dateStr, timeStr) => {
    try {
      const [day, month, year] = dateStr.split(/[-.]/).map(Number);
      const [hour, minute] = timeStr.split(":").map(Number);
      if ([day, month, year, hour, minute].some(isNaN)) throw new Error("Ungültiges Datum oder Zeit");

      // Date in UTC erzeugen
      const utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
      const date = new Date(utcTimestamp);

      const pad = (num) => num.toString().padStart(2, "0");

      const isoString =
        `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T` +
        `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.000Z`;

      console.log("convertToDate:", dateStr, timeStr, "->", isoString);
      return isoString;
    } catch {
      console.warn("convertToDate: Ungültiges Datum oder Zeit:", dateStr, timeStr);
      return null;
    }
  };

  // Vorstellung laden anhand Film-ID + date + time
  useEffect(() => {
    if (!id || !date || !time) return;

    let isMounted = true;
    const isoString = convertToDate(date, time);
    if (!isoString) {
      setAktuelleVorstellung(null);
      return;
    }

    const dateObj = new Date(isoString);

    axios.get(`http://localhost:5000/api/vorstellungen`, { params: { filmId: id } })
      .then(res => {
        if (!isMounted) return;

        if (!Array.isArray(res.data)) {
          console.error("Erwartet Array von Vorstellungen, bekommen:", res.data);
          setAktuelleVorstellung(null);
          return;
        }

        const vorstellung = res.data.find(v => {
          const startzeitString = typeof v.startzeit === "string" ? v.startzeit : v.startzeit?.$date;
          if (!startzeitString) return false;
          const startzeit = new Date(startzeitString);
          return startzeit.getTime() === dateObj.getTime();
        });
        

        if (!vorstellung) {
          console.warn("Keine passende Vorstellung gefunden");
        }

        setAktuelleVorstellung(vorstellung || null);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error("Fehler beim Laden der Vorstellungen:", err);
        setAktuelleVorstellung(null);
      });

    return () => {
      isMounted = false;
    };
  }, [id, date, time]);

  // Saal laden (abhängig vom Film)
  useEffect(() => {
    if (!film) return;

    let isMounted = true;
    axios.get("http://localhost:5000/api/saal")
      .then(res => {
        if (!isMounted) return;
        const passenderSaal = res.data.find(s => s._id === film.saalId || s.id === film.saalId);
        setSaal(passenderSaal || null);
      })
      .catch(err => console.error("Fehler beim Laden des Saals:", err));

    return () => {
      isMounted = false;
    };
  }, [film]);

  // Vorstellungssitze für aktuelle Vorstellung laden
  useEffect(() => {
    if (!aktuelleVorstellung?._id) return;

    let isMounted = true;
    axios.get(`http://localhost:5000/api/vorstellungssitze`, {
      params: { vorstellungId: aktuelleVorstellung._id }
    })
      .then(res => {
        if (!isMounted) return;
        setVorstellungssitze(res.data);
      })
      .catch(err => console.error("Fehler beim Laden der Vorstellungssitze:", err));

    return () => {
      isMounted = false;
    };
  }, [aktuelleVorstellung]);

  // Prüfen ob Sitz belegt ist
  const istSitzBelegt = (reihe, nummer) => {
    if (!aktuelleVorstellung?._id) return false;

    return vorstellungssitze.some(s => {
      const vorstellungIdStr = typeof s.vorstellungId === "object" ? s.vorstellungId.$oid : s.vorstellungId;
      return (
        s.status === "belegt" &&
        vorstellungIdStr === aktuelleVorstellung._id &&
        s.sitz?.reihe === reihe &&
        s.sitz?.nummer === nummer
      );
    });
  };

  // Sitz klicken zum Auswählen
  const handleClick = (index) => {
    if (selectedSeats.includes(index)) {
      setSelectedSeats(selectedSeats.filter(i => i !== index));
    } else {
      setSelectedSeats([...selectedSeats, index]);
    }
  };

  // Spalten- und Reihenlabels aus Saal-Sitzen extrahieren und sortieren
  const spaltenLabels = saal?.sitze
    ? [...new Set(saal.sitze.map(s => s.nummer))].sort((a, b) => a - b)
    : [];

  const reihenLabels = saal?.sitze
    ? [...new Set(saal.sitze.map(s => s.reihe))].sort()
    : [];

  return (
    <div className="bodySitzplaetze">
      <h1>
        {film ? film.name || film.titel || film.id : "wird geladen..."} {date} {time}
      </h1>
      <h2>{saal ? saal.name : "Saal wird geladen..."}</h2>

      <div className="Filmwand">
        <p className="LeinwandText">Leinwand</p>
      </div>

      <div className="grid-container">
        <div className="corner-cell"></div>

        {spaltenLabels.map((colNum) => (
          <div key={`col-${colNum}`} className="col-header">
            <p>{colNum}</p>
          </div>
        ))}

        {reihenLabels.map((reiheLabel) => (
          <React.Fragment key={`row-${reiheLabel}`}>
            <div className="row-header">
              <p>{reiheLabel}</p>
            </div>

            {spaltenLabels.map((nummer) => {
              const sitz = saal.sitze.find(s => s.reihe === reiheLabel && s.nummer === nummer);

              if (!sitz) {
                return <div key={`${reiheLabel}-${nummer}`} className="empty-seat"></div>;
              }

              const isBehindert = sitz.typ === "behindert";
              const isLoge = sitz.typ === "loge";
              const isBelegt = istSitzBelegt(sitz.reihe, sitz.nummer);
              const isDisabled = isBelegt;
              const index = saal.sitze.indexOf(sitz);
              const isSelected = selectedSeats.includes(index);

              return (
                <button
                  key={`${reiheLabel}-${nummer}`}
                  className={`Sitze
                    ${isSelected ? "selected" : ""}
                    ${isBehindert ? "behindert" : ""}
                    ${isLoge ? "loge" : ""}
                    ${isBelegt ? "belegt" : ""}
                  `}
                  onClick={() => !isDisabled && handleClick(index)}
                  disabled={isDisabled}
                  title={`${sitz.reihe}${sitz.nummer} (${sitz.typ})${isBelegt ? " - belegt" : ""}`}
                >
                  <FontAwesomeIcon icon={faCouch} />
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Sitzplaetze;
