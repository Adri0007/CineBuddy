import { useState , React } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { QRCodeCanvas } from 'qrcode.react';

import './TicketPage.css';

export function Ticketseite() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="bodyTicket">

        <h2>Mein QR Code</h2>
        <QRCodeCanvas value="https://youtube.com" size={200} />

      <button className="suchButton" onClick={() => setShowSearch(prev => !prev)}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      <button className="ticketButton" onClick={() => navigate('/Tickets')}>
        <FontAwesomeIcon icon={faTicket} />
      </button>
      <button className="accountButton" onClick={() => navigate('/Account')}>
        <FontAwesomeIcon icon={faUser} />
      </button>

      {showSearch && <div>Suchfunktion kommt noch...</div>}
    </div>
  );
}

export default Ticketseite;
