import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faHome, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import './Sitzplaetze.css';

function Sitzplaetze() {
  const { id, date } = useParams();
  const navigate = useNavigate();
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


  // Vorstellung laden anhand Film-ID + date + time
  useEffect(() => {
    if (!id || !date) return;

    let isMounted = true;
    const dateObj = new Date(date);

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
          const zeitenGleich = startzeit.getTime() === dateObj.getTime();
          const idGleich = v.filmId === id || v.filmId?.$oid === id;

          return zeitenGleich && idGleich;
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
  }, [id, date]);

  // Saal laden (abhängig von der Vorstellung)
  useEffect(() => {
    if (!aktuelleVorstellung?.saalId) return;
  
    let isMounted = true;
    axios.get("http://localhost:5000/api/saal")
      .then(res => {
        if (!isMounted) return;
        const saalId = typeof aktuelleVorstellung.saalId === "object" ? aktuelleVorstellung.saalId.$oid : aktuelleVorstellung.saalId;
        const passenderSaal = res.data.find(s => s._id === saalId || s.id === saalId);
        setSaal(passenderSaal || null);
      })
      .catch(err => console.error("Fehler beim Laden des Saals:", err));
  
    return () => {
      isMounted = false;
    };
  }, [aktuelleVorstellung]);
  

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

    console.log("WICHTIG " + aktuelleVorstellung?._id);
    console.log("WICHTIG " + film?._id);
    const gefunden = vorstellungssitze.find(s => {
      const vorstellungIdStr = typeof s.vorstellungId === "object" ? s.vorstellungId.$oid : s.vorstellungId;
      const match =
        s.status === "belegt" &&
        vorstellungIdStr === aktuelleVorstellung._id &&
        s.sitz?.reihe === reihe &&
        s.sitz?.nummer === nummer;

      if (match) {
        console.log("Belegter Sitz gefunden:", s.sitz, "für Vorstellung", aktuelleVorstellung._id);
      }
      return match;
    });

    if (!gefunden) {
      console.log(`Sitz ${reihe}${nummer} nicht belegt`);
    }
    return !!gefunden;
  };


  // Sitz klicken zum Auswählen
  const handleClick = (index) => {
    const isAlreadySelected = selectedSeats.includes(index);
  
    if (isAlreadySelected) {
      // Sitz abwählen
      setSelectedSeats(selectedSeats.filter(i => i !== index));
    } else if (selectedSeats.length < 5) {
      // Nur hinzufügen, wenn noch weniger als 5 ausgewählt sind
      setSelectedSeats([...selectedSeats, index]);
    }
  };
  

  // Spalten- und Reihenlabels aus Saal-Sitzen extrahieren und sortieren
  const spaltenLabels = saal?.sitze
    ? [...new Set(saal.sitze.map(s => s.nummer))].sort((a, b) => a - b)
    : [];
  const leinwandBreite = `calc(${spaltenLabels.length} * clamp(6vh, 10vw, 10vh) + ${(spaltenLabels.length - 1)} * 1vh)`;

  const formatDateTime = (isoString) => {
    const datum = new Date(isoString);
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    return `${datum.toLocaleDateString('de-DE', optionsDate)}, ${datum.toLocaleTimeString('de-DE', optionsTime)} Uhr`;
  };


  const reihenLabels = saal?.sitze
    ? [...new Set(saal.sitze.map(s => s.reihe))].sort()
    : [];

  return (
    <div className="bodySitzplaetze">
      <h1>{film ? film.name || film.titel || film.id : "wird geladen..."}</h1>
      <h2> {formatDateTime(date)} </h2>
      <h2>{saal ? saal.name : "Saal wird geladen..."}</h2>

      <div className="grid-container">
        <div
          className="Filmwand"
          style={{
            gridColumn: `2 / span ${spaltenLabels.length}`
          }}
        >
          <p className="LeinwandText">Leinwand</p>
        </div>
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

              console.log(
                `Sitz ${sitz.reihe}${sitz.nummer} | Typ: ${sitz.typ} | Belegt: ${isBelegt} | Disabled: ${isDisabled}`
              );

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

      <h1 style={{ marginTop: "4vh" }}>Legende</h1>
      <div className="legende">
        <div className="legendeneintrag">
          <button className="Sitze" disabled><FontAwesomeIcon icon={faCouch} /></button>
          <span>Normal</span>
        </div>
        <div className="legendeneintrag">
          <button className="Sitze belegt" disabled><FontAwesomeIcon icon={faCouch} /></button>
          <span>Besetzt</span>
        </div>
        <div className="legendeneintrag">
          <button className="Sitze behindert" disabled><FontAwesomeIcon icon={faCouch} /></button>
          <span>Behindert</span>
        </div>
        <div className="legendeneintrag">
          <button className="Sitze loge" disabled><FontAwesomeIcon icon={faCouch} /></button>
          <span>Loge</span>
        </div>
        <div className="legendeneintrag">
          <button className="Sitze ausgewählt" disabled><FontAwesomeIcon icon={faCouch} /></button>
          <span>Ausgewählt</span>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "4vh" }}>
        <h1>Deine Bestellung</h1>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {selectedSeats.map((index) => {
            const sitz = saal?.sitze[index];
            if (!sitz) return null;

            return (
              <li key={index}>
                Reihe {sitz.reihe}, Platz {sitz.nummer} ({sitz.typ})
              </li>
            );
          })}
          {selectedSeats.length === 0 && <li>Keine Sitze ausgewählt</li>}
        </ul>
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

      <button
        className="Weiter"
        disabled={selectedSeats.length === 0}
        style={{
          opacity: selectedSeats.length === 0 ? 0.5 : 1,
          cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
          marginTop: '20px'
        }}
        onClick={() => {
          if (!saal || selectedSeats.length === 0) return;

          const ausgewaehlteSitze = selectedSeats.map(index => saal.sitze[index]);
          sessionStorage.setItem("ausgewählteSitze", JSON.stringify(ausgewaehlteSitze));
          navigate('/Buchungsseite');
        }}
      >
        Weiter
      </button>
    </div>
  );
}

export default Sitzplaetze;
