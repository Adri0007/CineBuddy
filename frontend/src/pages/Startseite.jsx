import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import './Startseite.css';

export function Startseite() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filme, setFilme] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/filme')
      .then(res => setFilme(res.data))
      .catch(err => console.error("Fehler beim Laden der Filme:", err));
  }, []);

  const gefilterteFilme = filme.filter(film =>
    film.titel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {showSearch && (
        <div className="suchbereich">
          <input
            type="text"
            placeholder="Film suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <div className="bild-galerie">
        {gefilterteFilme.map((film) => (
          <Link to={`/Film/${film._id}`} className="Film" key={film._id}>
            <img src={film.bild} alt={film.titel || "Filmbild"} />
          </Link>
        ))}
      </div>

      <div className="buttonBar">
        <button className="suchButton" onClick={() => setShowSearch(prev => !prev)}>
          Suchen <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button className="ticketButton" onClick={() => navigate('/Tickets')}>
          Ticket <FontAwesomeIcon icon={faTicket} />
        </button>
        <button className="accountButton" onClick={() => navigate('/Account')}>
          Account <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </>
  );
}

export default Startseite;