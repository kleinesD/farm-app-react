import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { DotsThreeOutlineVertical, DotsThreeVertical, Check } from "@phosphor-icons/react";
import { X } from "@phosphor-icons/react/dist/ssr";

interface AnimalItemProps {
  animal: any,
  filter: any,
  activeMenu: string | null,
  setActiveMenu: any,
  selected: (obj: any) => void,
  selectDefault: boolean
}

const AnimalItem: React.FC<AnimalItemProps> = ({ animal, filter, activeMenu, setActiveMenu, selected, selectDefault }) => {
  const [select, setSelect] = useState<boolean>(selectDefault);
  const [selectVis, setSelectVis] = useState<boolean>(false);

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === animal._id ? null : animal._id);
  }

  const handleSelection = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelect((prev) => {
      const newSelect = !prev;
      setTimeout(() => selected({ add: newSelect, animal }), 0);
      return newSelect;
    });
  };


  if (animal.status === 'alive') {
    return (
      <div className={`al-animal`} onMouseEnter={() => setSelectVis(true)} onMouseLeave={() => setSelectVis(false)}>
        {(selectVis || select) &&
          <div className="al-animal-select-box" onClick={handleSelection}>
            {select &&
              <div className="al-animal-selected">
                <Check size={14} color="#f0f0f0" weight="bold" />
              </div>
            }
          </div>
        }

        <div className="al-item al-item-photo">
          <div className={`al-item-image-outter ${animal.gender === 'male' ? 'al-item-photo-male' : 'al-item-photo-female'}`}>
            <img src={`${process.env.PUBLIC_URL}/img/images/${animal.mainPhoto}`} />
          </div>
        </div>

        <div className="al-item al-item-number">{animal.number}</div>
        <div className="al-item">{Math.round((Date.now() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30)} м.</div>
        <div className="al-item">{animal.gender === 'female' ? 'Женский' : 'Мужской'}</div>

        {filter === 'slaughter' && (
          <React.Fragment>
            {animal.butcherSuggestionReason === 'weight' &&
              <div className="al-item al-item-info">Вес</div>
            }
            {animal.butcherSuggestionReason === 'age' &&
              <div className="al-item al-item-info">Возраст</div>
            }
            {animal.butcherSuggestionReason === 'insemination' &&
              <div className="al-item al-item-info">Плохо осеменяется</div>
            }
          </React.Fragment>
        )}

        {filter !== 'slaughter' && (
          <div className={`al-item al-item-info current-info-${animal.currentInfoAB?.status}`}>
            {(animal.currentInfoAB && animal.currentInfoAB.status !== undefined && animal.currentInfoAB.message !== '') && (
              <React.Fragment>
                <div className="ar-outter-circle"></div>
                <div className="ar-important-text">{animal.currentInfoAB.message}</div>
              </React.Fragment>
            )}
          </div>
        )}

        <div className="al-item al-item-name">{animal.name}</div>

        <div className="al-add-action-btn" onClick={toggleMenu}>
          <DotsThreeVertical size={20} color="#0a0a0a" weight="bold" />
        </div>

        {activeMenu === animal._id && (
          <div className="animal-actions-block rc-menu" style={{ position: 'absolute' }}>
            <Link to={`/herd/animal/card/${animal._id}`} className="rc-menu-item"><p>Карта животного</p></Link>

            {animal.status === 'alive' &&
              <Link to={`/herd/animal/add/alive/?edit=true&id=${animal._id}`} className="rc-menu-item"><p>Редактировать животное</p></Link>
            }

            {animal.status === 'dead-birth' &&
              <Link to={`/herd/animal/add/dead/?edit=true&id${animal._id}`} className="rc-menu-item"><p>Редактировать мертворождение</p></Link>
            }

            {animal.gender === 'female' &&
              <React.Fragment>
                <Link to={`/herd/lactation/${animal._id}`} className="rc-menu-item"><p>Добавить лактацию</p></Link>

                {(animal.lactations?.length > 0 && !animal.lactations.at(-1).finishDate) &&
                  <Link to={`/herd/lactation/${animal._id}/?edit=true&id=${animal.lactations.at(-1)._id}`} className="rc-menu-item"><p>Окончить лактацию</p></Link>
                }

                {animal.lactations?.length > 0 &&
                  <Link to={`/herd/milking/${animal._id}`} className="rc-menu-item"><p>Добавить результат доения</p></Link>
                }
              </React.Fragment>
            }

            <Link to={`/herd/weight/${animal._id}`} className="rc-menu-item"><p>Добавить взвешивание</p></Link>

            <Link to={`/herd/write-off/?animals=${animal.number}`} className="rc-menu-item"><p>Списать животное</p></Link>

          </div>
        )}
      </div>
    )
  }

  if (animal.status === 'diseased') {
    return (
      <div className={`al-animal al-animal-former`}>
        <div className="al-former-icon">
          <X size={18} color="#0a0a0a" weight="bold" />
        </div>

        <div className="al-item al-item-photo">
          <div className={`al-item-image-outter ${animal.gender === 'male' ? 'al-item-photo-male' : 'al-item-photo-female'}`}>
            <img src={`${process.env.PUBLIC_URL}/img/images/${animal.mainPhoto}`} />
          </div>
        </div>

        <div className="al-item al-item-number">{animal.number}</div>
        <div className="al-item">-</div>
        <div className="al-item">{animal.gender === 'female' ? 'Женский' : 'Мужской'}</div>

        <div className="al-item al-item-info">
          {animal.writeOffReason === 'slaughtered' &&
            <div className="ar-important-text">Забой: {moment(animal.writeOffDate).locale('ru').format('DD.MM.YYYY')}</div>
          }
          {animal.writeOffReason === 'sold' &&
            <div className="ar-important-text">Продажа: {moment(animal.writeOffDate).locale('ru').format('DD.MM.YYYY')}</div>
          }
          {animal.writeOffReason === 'sickness' &&
            <div className="ar-important-text">Болезнь: {moment(animal.writeOffDate).locale('ru').format('DD.MM.YYYY')}</div>
          }
        </div>

        <div className="al-item al-item-name">{animal.name}</div>

        <div className="al-add-action-btn" onClick={toggleMenu}>
          <DotsThreeVertical size={20} color="#0a0a0a" weight="bold" />
        </div>

        {activeMenu === animal._id && (
          <div className="animal-actions-block rc-menu">
            <Link to={`/herd/animal/card/${animal._id}`} className="rc-menu-item"><p>Карта животного</p></Link>
          </div>
        )}
      </div>
    )
  }

  if (animal.status === 'dead-birth') {
    return (
      <div className={`al-animal al-animal-former`}>
        <div className="al-former-icon">
          <X size={18} color="#0a0a0a" weight="bold" />
        </div>

        <div className="al-item al-item-photo">
          <div className={`al-item-image-outter ${animal.gender === 'male' ? 'al-item-photo-male' : 'al-item-photo-female'}`}>
            <img src={`${process.env.PUBLIC_URL}/img/images/${animal.mainPhoto}`} />
          </div>
        </div>

        <div className="al-item al-item-number">-</div>
        <div className="al-item">-</div>
        <div className="al-item">{animal.gender === 'female' ? 'Женский' : 'Мужской'}</div>

        <div className="al-item al-item-info">
          <div className="ar-important-text">Мертворождение: {moment(animal.deadBirthDate).locale('ru').format('DD.MM.YYYY')}</div>
        </div>

        <div className="al-item al-item-name">{animal.name}</div>

        <div className="al-add-action-btn" onClick={toggleMenu}>
          <DotsThreeVertical size={20} color="#0a0a0a" weight="bold" />
        </div>

        {activeMenu === animal._id && (
          <div className="animal-actions-block rc-menu">
            <Link to={`/herd/animal/add/dead/?edit=true&id=${animal._id}`} className="rc-menu-item"><p>Редактировать мертворождение</p></Link>
          </div>
        )}
      </div>
    )
  }

}

export default AnimalItem;