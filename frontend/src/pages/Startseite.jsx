import { getFilme } from "../../api"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';

import './Startseite.css';

export function Home() {

  const [posts, setPosts] = useState([])
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadAllFilm() {
      const data = await getFilme()
      setPosts(data)
    }
    loadAllFilm()
  }, [])

  const filteredPosts = posts.filter((film) =>
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
          />
          <button>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      )}

      <div className="bild-galerie">
        {filteredPosts.map((film) => (
          <Link to={`/Film/${film._id}`} className="Film" key={film._id}>
            <img src={`${film.bild}`} alt={film.titel} />
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

  )
}

export default Home
