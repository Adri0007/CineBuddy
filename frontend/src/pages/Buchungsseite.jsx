import React, { useEffect, useState } from "react";

function Buchungsseite() {
  const [ausgewaehlteSitze, setAusgewaehlteSitze] = useState([]);

  useEffect(() => {
    const gespeicherteSitze = sessionStorage.getItem("ausgewählteSitze");
    if (gespeicherteSitze) {
      try {
        setAusgewaehlteSitze(JSON.parse(gespeicherteSitze));
      } catch (e) {
        console.error("Fehler beim Parsen der gespeicherten Sitze:", e);
      }
    }
  }, []);

  return (
    <div>
      <h1>Buchungsseite</h1>
      <h2>Deine ausgewählten Sitze:</h2>
      <ul>
        {ausgewaehlteSitze.map((sitz, index) => (
          <li key={index}>
            Reihe {sitz.reihe}, Platz {sitz.nummer} ({sitz.typ})
          </li>
        ))}
        {ausgewaehlteSitze.length === 0 && <li>Keine Sitzdaten gefunden</li>}
      </ul>
    </div>
  );
}

export default Buchungsseite;
