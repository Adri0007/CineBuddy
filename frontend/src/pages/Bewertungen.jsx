import "./Bewertungen.css";
import SterneAnzeige from '../components/SterneAnzeige';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function Bewertungen() {
    const [bewertungen, setBewertungen] = useState([]);
    const [sterne, setSterne] = useState(0);
    const [kommentar, setKommentar] = useState("");
    const { id } = useParams();

    useEffect(() => {
        fetchBewertungen();
    }, [id]);

    const fetchBewertungen = () => {
        axios.get(`http://localhost:5000/api/bewertungen/${id}`)
            .then(res => setBewertungen(res.data))
            .catch(err => console.error(err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (sterne < 1 || sterne > 5) {
            alert("Bitte wähle eine Sternebewertung zwischen 1 und 5.");
            return;
        }

        axios.post(`http://localhost:5000/api/bewertungen/${id}`, {
            sterne,
            kommentar,
            ticketId,
            userName,
            filmId,
        })
            .then(() => {
                setKommentar("");
                setSterne(0);
                setTicketId("");
                setUserName("");
                fetchBewertungen(); // Bewertungen neu laden
            })
            .catch(err => {
                console.error(err);
                alert("Fehler beim Absenden der Bewertung.");
            });
    };

    return (
        <div>
            <h2>Film Bewerten</h2>
            <form onSubmit={handleSubmit} className="bewertung-form">
                <p>
                <label>
                    Sterne: 
                    <select value={sterne} onChange={(e) => setSterne(parseInt(e.target.value))}>
                        <option value={0}>-- Bitte wählen --</option>
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(n => (
                            <option key={n} value={n}>{n} Stern{n > 1 ? 'e' : ''}</option>
                        ))}
                    </select>
                </label>
                </p>
                
                <label>
                    Kommentar (optional): 
                    <p>
                    <textarea
                        value={kommentar}
                        onChange={(e) => setKommentar(e.target.value)}
                        rows={4}
                        placeholder="Dein Kommentar"
                    />
                    </p>
                </label>
                <button type="submit">Bewertung absenden</button>
            </form>
            <h2>Bewertungen</h2>
            {bewertungen.length > 0 ? (
                bewertungen.map((bewertung, index) => (
                    <div key={index} className="bewertung-eintrag">
                        <p className="User"><strong>User: {bewertung.userName}</strong></p>
                        <p className="Sterne"><strong>Sterne:</strong><SterneAnzeige rating={bewertung.sterne} /></p>
                        <p className="Kommentar"><strong>Kommentar: {bewertung.kommentar}</strong></p>
                    </div>
                ))
            ) : (
                <p>Keine Bewertungen vorhanden.</p>
            )}
        </div>
    );
}

export default Bewertungen;
