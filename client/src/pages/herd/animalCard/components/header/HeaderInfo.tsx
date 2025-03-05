import React from "react";
import usePPDCall from "../../../../../hooks/api/usePPDCall";
import { Link } from "react-router-dom";
import { Gear, CalendarDots, GenderIntersex, Cow, Palette } from "@phosphor-icons/react";
import moment from "moment";
import GroupInput from "./components/GroupInput";
import BuildingInput from "./components/BuildingInput";
import SpotInput from "./components/SpotInput";

interface HeaderInfoProps {
  animal: any
}

const HeaderInfo: React.FC<HeaderInfoProps> = ({ animal }) => {

  return (
    <div className="animal-info-header">
      <div className="aih-image-block">
        <img src={`${process.env.PUBLIC_URL}/img/images/default-cow-image.png`} />
      </div>

      <div className="aih-details-container">
        <div className="aih-details-info">
          <div className="aih-details-info-number">#{animal?.number}</div>
          <div className="aih-details-info-name">{animal?.name ? animal?.name : ''}</div>
          <Link className="aih-edit-btn" to={`/herd/animal/add/alive/?edit=true&id=${animal?._id}`}>
            <Gear size={32} color="#0a0a0a" weight="fill" />
          </Link>

          <div className="aih-details-row">

            <div className="aih-details-row-item">
              <CalendarDots size={20} color="#0a0a0a" weight="bold" />
              <div className="aih-details-text">{moment(animal?.birthDate).format('DD.MM.YYYY')}</div>
            </div>

            {animal?.gender &&
              <div className="aih-details-row-item" data-qt="Пол">
                <GenderIntersex size={20} color="#0a0a0a" weight="bold" />
                <div className="aih-details-text">{animal.gender === 'male' ? 'Мужской' : 'Женский'}</div>
              </div>
            }
            {animal?.breedRussian &&
              <div className="aih-details-row-item">
                <Cow size={20} color="#0a0a0a" weight="bold" />
                <div className="aih-details-text">{animal.breedRussian}</div>
              </div>
            }
            {animal?.colors &&
              <div className="aih-details-row-item">
                <Palette size={20} color="#0a0a0a" weight="bold" />
                <div className="aih-details-text">
                  {animal.colors?.includes('black') ? '• Черный ' : ''}
                  {animal.colors?.includes('white') ? '• Белый ' : ''}
                  {animal.colors?.includes('red') ? '• Красный ' : ''}
                  </div>
              </div>
            }

          </div>
        </div>
      </div>

      <div className="aih-additional-info-block">
          { animal && <GroupInput animal={animal}/>}
          { animal && <BuildingInput animal={animal}/>}
          { animal && <SpotInput animal={animal}/>}
      </div>

    </div>
  )
}

export default HeaderInfo;