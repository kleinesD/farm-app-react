import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

interface FamilyTreeProps {
  animal: any
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ animal }) => {
  
  return (
    <div className="ac-family-block">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Родословная</div>
      </div>

      {(animal?.mother || animal?.father) &&
        <div className="ac-fb-line">
          <div className="ac-fb-container">
            {animal?.mother &&
              <Link className="ac-fb-item" to={`/herd/animal/card/${animal.mother._id}`}>
                <img src={`${process.env.PUBLIC_URL}/img/images/default-cow-image.png`} />
                <div className="ac-fb-item-body">
                  <div className="ac-fb-item-title">#{animal.mother.number}</div>
                  <div className="ac-fb-item-text">Мать</div>
                </div>
              </Link>
            }
            {animal?.father &&
              <Link className="ac-fb-item" to={`/herd/animal/card/${animal.father._id}`}>
                <img src={`${process.env.PUBLIC_URL}/img/images/default-cow-image.png`} />
                <div className="ac-fb-item-body">
                  <div className="ac-fb-item-title">#{animal.father.number}</div>
                  <div className="ac-fb-item-text">Отец</div>
                </div>
              </Link>
            }

          </div>

          <div className="ac-fb-line-title">Родители</div>
        </div>
      }

      <div className="ac-fb-line">
        <div className="ac-fb-container">
          <div className="ac-fb-item">
            <img src={`${process.env.PUBLIC_URL}/img/images/default-cow-image.png`} />
            <div className="ac-fb-item-body">
              <div className="ac-fb-item-title">#{animal?.number}</div>
              <div className="ac-fb-item-text">{animal?.name ? animal?.name : ''}</div>
            </div>
          </div>
        </div>
      </div>

      {(animal?.motherCalves?.length > 0 || animal?.fatherCalves?.length > 0) &&
        <div className="ac-fb-line">
          <div className="ac-fb-container">
            {[...animal?.motherCalves, ...animal?.fatherCalves].map((calf: any, index: number) => {

              if (calf.status !== 'dead-birth') {
                return (
                  <Link key={index} className="ac-fb-item" to={`/herd/animal/card/${calf._id}`}>
                    <img src={`${process.env.PUBLIC_URL}/img/images/default-cow-image.png`} />
                    <div className="ac-fb-item-body">
                      <div className="ac-fb-item-title">#{calf.number}</div>
                      <div className="ac-fb-item-text">{moment(calf.birthDate).locale('ru').format('DD MMMM, YYYY')}</div>
                    </div>
                  </Link>
                )
              } else {
                return (
                  <div key={index} className="ac-fb-item">
                    <img src={`${process.env.PUBLIC_URL}/img/images/default-cow-image.png`} />
                    <div className="ac-fb-item-body">
                      <div className="ac-fb-item-title">Мертворождение</div>
                      <div className="ac-fb-item-text">{moment(calf.deadBirthDate).locale('ru').format('DD MMMM, YYYY')}</div>
                    </div>
                  </div>
                )
              }
            })}

          </div>

          <div className="ac-fb-line-title">Телята</div>
        </div>
      }

    </div>
  )
}

export default FamilyTree;