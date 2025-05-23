import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import './Startseite.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Startseite() {
  const [filme, setFilme] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:5000/api/filme')
      .then(res => setFilme(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
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
      <div className="bild-galerie">
       {filme.map(film => (
       <Link key={film._id} to={`/film/${film._id}`}>
       <img src={film.bild} alt={film.titel} />
       </Link>
         ))}
      </div>

    </>
  );
}

export default Startseite;