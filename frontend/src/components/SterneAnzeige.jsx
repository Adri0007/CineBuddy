import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';

function SterneAnzeige({ rating }) {
  const volleSterne = Math.floor(rating);
  const halbStern = rating - volleSterne >= 0.5;
  const leereSterne = 5 - volleSterne - (halbStern ? 1 : 0);

  return (
    <div>
      {[...Array(volleSterne)].map((_, i) => (
        <FontAwesomeIcon key={'voll' + i} icon={faStar} style={{ color: '#FFD700' }} />
      ))}
      {halbStern && <FontAwesomeIcon icon={faStarHalfStroke} style={{ color: '#FFD700' }} />}
      {[...Array(leereSterne)].map((_, i) => (
        <FontAwesomeIcon key={'leer' + i} icon={faStarEmpty} style={{ color: '#ccc' }} />
      ))}
    </div>
  );
}

export default SterneAnzeige;
