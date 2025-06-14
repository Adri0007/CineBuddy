import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faFull, faStarHalfStroke, faStar as faEmpty } from '@fortawesome/free-solid-svg-icons';

function SterneAuswahl({ value, onChange }) {
    const [hoverValue, setHoverValue] = useState(null);

    // setzt Bewertungwert bei Click
    const handleClick = (index, isHalf) => {
        const selectedValue = isHalf ? index + 0.5 : index + 1;
        onChange(selectedValue);
    };

    //Bestimmt ob ganzer oder halber Stern mit Mausposition
    const handleMouseMove = (e, index) => {
        const { left, width } = e.target.getBoundingClientRect();
        const isHalf = (e.clientX - left) < width / 2;
        setHoverValue(isHalf ? index + 0.5 : index + 1);
    };

    //Setzt Hover zurück
    const handleMouseLeave = () => {
        setHoverValue(null);
    };


    const renderStar = (index) => {
        const currentValue = hoverValue !== null ? hoverValue : value;
        const isFull = currentValue >= index + 1;
        const isHalf = !isFull && currentValue >= index + 0.5;

        //Richtiges Icon auswählen
        let icon = faEmpty;
        if (isFull) icon = faFull;
        else if (isHalf) icon = faStarHalfStroke;

        return (
            <span
                key={index}
                onClick={(e) => handleClick(index, (e.nativeEvent.offsetX < 12))} // 24px ist Sterngröße
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer', fontSize: '2rem', color: isFull || isHalf ? '#FFD700' : '#ccc' }}
            >
                <FontAwesomeIcon icon={icon} />
            </span>
        );
    };

    return <div>{[0, 1, 2, 3, 4].map(renderStar)}</div>;
}

export default SterneAuswahl;
