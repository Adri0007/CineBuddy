import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';
import './Ticketseite.css';
import MenuButtons from "../components/MenuButtons";

function Ticketseite() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => { // wenn der user nicht eingelogt ist, wird er zur Anmeldung umgeleitet.
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/Anmeldung');
  };

  useEffect(() => {
    if (!userEmail) {
      handleLogout();
      return;
    }
    async function fetchTickets() {
      try {  // API-Request zum Backend für alle Tickets dieses Nutzers, nach der suche der E-Mail.
        const response = await fetch(
          `http://localhost:5000/api/ticket-details?email=${encodeURIComponent(userEmail)}`
        );
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setTickets(data.tickets || []);
        }
      } catch (err) {
        setError("Tickets konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, [userEmail, navigate]);

  return (
    <div className="bodyTicket">
      {loading ? (
        <div style={{ color: "#fff", marginTop: "2rem" }}>Lade Ticketdaten...</div>
      ) : error ? (
        error === "Kein Ticket gefunden" ? (
          <div className="ticket-headline" style={{ marginTop: "0rem" }}>
            Keine Tickets vorhanden.
          </div>
        ) : (
          <>
            <div style={{ color: "#fff", marginTop: "2rem" }}>{error}</div>
            <button onClick={handleLogout} style={{ marginTop: "2rem" }}>Abmelden</button>
          </>
        )
      ) : (
        <>
          <h2 className="ticket-headline">Meine Tickets</h2>
          <div className="all-tickets-list">
            {tickets.map((ticket, idx) => {
              const qrValue = JSON.stringify({
                filmId: ticket.filmId,
                vorstellungsId: ticket.vorstellungsId,
                sitze: ticket.sitze,
                filmTitel: ticket.film,
                datum: ticket.datum,
                uhrzeit: ticket.uhrzeit
              });
              return (
                <div key={idx} className="ticket-shadow-wrapper">
                  <div className="ticket-main-box">
                    <div className="ticket-info-box">
                      <div><b>Film:</b> {ticket.film}</div>
                      <div><b>Datum:</b> {ticket.datum}</div>
                      <div><b>Uhrzeit:</b> {ticket.uhrzeit}</div>
                      <div><b>Saal:</b> {ticket.saal}</div>
                      <div className="row-platz">
                        <div><b>Reihe:</b> {ticket.reihe}</div>
                        <div><b>Platz:</b> {ticket.platz}</div>
                      </div>
                    </div>
                    <div className="ticket-qr-box">
                      <QRCodeCanvas value={qrValue} size={200} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <MenuButtons />
    </div>
  );
}

export default Ticketseite;
