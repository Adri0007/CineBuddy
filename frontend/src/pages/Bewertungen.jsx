import "./Bewertungen.css";
import SterneAnzeige from '../components/SterneAnzeige';
import MenuButtons from "../components/MenuButtons";
import SterneAuswahl from '../components/SterneAuswahl';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function Bewertungen() {
  const [bewertungen, setBewertungen] = useState([]);
  const [sterne, setSterne] = useState(0);
  const [kommentar, setKommentar] = useState("");
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const { id } = useParams();
  const [durchschnitt, setDurchschnitt] = useState(null);
  const [film, setFilm] = useState(null);
  const userName = userData?.username || "";
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const email = localStorage.getItem('userEmail'); // Email aus Local Storage holen

  useEffect(() => {
    fetchBewertungen();
    if (localStorage.getItem("isLoggedIn")) {
      axios.get(`http://localhost:5000/api/user-data?email=${encodeURIComponent(email)}`) // User-Data per email holen
        .then(res => setUserData(res.data))
        .catch(err => console.error(err));
      axios.get(`http://localhost:5000/api/Ticket?email=${encodeURIComponent(email)}`) // Tickets per Email holen
        .then(res => setTickets(res.data))
        .catch(err => console.error(err));
      axios.get(`http://localhost:5000/api/filme/${id}`) //Aktuellen Film per id holen
        .then(res => setFilm(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const fetchBewertungen = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bewertungen/${id}`); // Alle bewertungen holen
      setBewertungen(res.data.reverse());  // Neueste zuerst
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/bewertungen/durchschnitt/${id}`); // bewertungsdurchschnitt
      setDurchschnitt(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Überprüfen ob Sterne ausgewählt
    if (sterne < 0.5 || sterne > 5) {
      setMessage('❌ Bitte wähle eine Sternebewertung zwischen 0,5 und 5.');
      setMessageType('error');
      return;
    }
    //Überprüfen ob angemeldet
    if (!userName || !localStorage.getItem("isLoggedIn")) {
      setMessage('❌ Bitte melde dich erst an, um eine Bewertung abzugeben.');
      setMessageType('error');
      return;
    }
    //Überprüfen ob bereits bewertet
    if (bewertungen.some((bewertung) => bewertung.userName === userName)) {
      setMessage('❌ Du hast diesen Film bereits bewertet.');
      setMessageType('error');
      return;
    }
    //Überprüfen des Tickets und Vorstellung ablauf
    const passendesTicket = tickets.find(ticket => String(ticket.filmId) === String(id));
    if (!passendesTicket) {
      setMessage('❌ Kein Ticket für diesen Film gefunden.');
      setMessageType('error');
      return;
    }
    const ticketId = passendesTicket._id;

    try {
      const res = await axios.get(`http://localhost:5000/api/vorstellungen?vorstellungId=${encodeURIComponent(passendesTicket.vorstellungsId)}`);
      const vorstellungen = res.data;
      const echteVorstellung = vorstellungen.find(v => v._id === passendesTicket.vorstellungsId);

      if (!echteVorstellung) {
        setMessage('❌ Vorstellung nicht gefunden.');
        setMessageType('error');
        return;
      }

      if (new Date(echteVorstellung.endzeit) > new Date()) {
        setMessage('❌ Du kannst erst nach der Vorstellung bewerten.');
        setMessageType('error');
        return;
      }
      //Speichern der Bewertungen
      await axios.post(`http://localhost:5000/api/bewertungen/${id}`, {
        sterne,
        kommentar,
        ticketId,
        userName,
        id,
      });

      setMessage('✅ Bewertung hinzugefügt!');
      setMessageType('success');
      setKommentar("");
      setSterne(0);
      await fetchBewertungen(); //Kommentare aktualisieren um neuen anzuzeigen
    } catch (err) {
      console.error(err);
      alert("Fehler beim Absenden der Bewertung.");
    }
  };

  return (
    <div className="bewertungenWrapper">
      <div className="bewertungenContainer">
        <h2 className="heading">{film ? film.titel + " Bewerten" : "Lade Film..."}</h2>
        <form onSubmit={handleSubmit} className="bewertungForm">
          <div>
            <label>
              Sterne:
              <SterneAuswahl value={sterne} onChange={setSterne} />
              <p>{sterne} Stern{sterne !== 1 ? 'e' : ''}</p>
            </label>
          </div>

          <label>
            Kommentar (optional):
            <div>
              <textarea
                className="textarea"
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
                rows={4}
                placeholder="Dein Kommentar"
                maxLength={200}
              />
            </div>
          </label>
          {message && <div className={`message ${messageType}`}>{message}</div>}
          <button type="submit" className="bewertungButton">Bewertung absenden</button>
        </form>

        <h2 className="heading">Bewertungen</h2>
        <h3>Durchschnitt: {durchschnitt?.durchschnitt !== undefined
          ? durchschnitt.durchschnitt.toFixed(1)
          : "Keine Bewertungen"}</h3>
        <div className="bewertungenListe">
          {bewertungen.length > 0 ? (
            bewertungen.map((bewertung, index) => (
              <div key={index} className="bewertungEintrag">
                <p className="user"><strong>User: {bewertung.userName}</strong></p>
                <div className="sterne"><strong>Sterne:</strong><SterneAnzeige rating={bewertung.sterne} /></div>
                {bewertung.kommentar && bewertung.kommentar.trim() !== "" && (
                  <p className="kommentar"><strong>Kommentar:</strong> {bewertung.kommentar}</p>
                )}
              </div>
            ))
          ) : (
            <p>Keine Bewertungen vorhanden.</p>
          )}
        </div>
      </div>
      <MenuButtons />
    </div>
  );
}

export default Bewertungen;
