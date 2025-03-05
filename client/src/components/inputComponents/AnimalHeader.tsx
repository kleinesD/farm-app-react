import React from "react";
import { Link } from "react-router-dom";

interface AnimalHeaderProps {
  animal: any
}

const AnimalHeader: React.FC<AnimalHeaderProps> = ({ animal }) => {

  return (
    <div className="animal-results-header">
      <img className="ar-header-photo" src={`${process.env.PUBLIC_URL}/img/images/${animal.mainPhoto}`} />

      {animal.name && <div className="ar-header-info">{animal.name}</div>}
      <div className="ar-header-info">#{animal.number}</div>

      {animal.currentInfoAB && animal.currentInfoAB.message !== '' &&
        <div className={`ar-header-important-info current-info-${animal.currentInfoAB.status}`}>
          <div className="ar-outter-circle"></div>
          <div className="ar-important-text">{animal.currentInfoAB.message}</div>
        </div>
        }
      <Link className="ar-header-animal-btn" to={`/herd/animal/card/${animal._id}`}>Карта: #{animal.number}</Link>

    </div>
  )
}

export default AnimalHeader;