import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHome, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


function MenuButtons() {
    const navigate = useNavigate();
    return (
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
    );
}

export default MenuButtons;