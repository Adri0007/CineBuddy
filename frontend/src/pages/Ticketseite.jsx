import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { QRCodeCanvas } from 'qrcode.react';
import './Ticketseite.css';

function Ticketseite() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
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
      try {
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
          <div className="ticket-headline" style={{ marginTop: "2.5rem" }}>
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
      {/* Bottom Navigation */}
      <div className="bottom-nav">
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

export default Ticketseite;
