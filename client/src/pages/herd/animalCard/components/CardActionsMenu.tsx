import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "@phosphor-icons/react";

interface CardActionsMenuProps {
  animal: any
}

const CardActionsMenu: React.FC<CardActionsMenuProps> = ({ animal }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div>
      <div className="acp-action-btn" onClick={() => setVisible(!visible)}>
        {visible
          ?
          <X size={24} color="#f0f0f0" weight="bold" />
          :
          <Plus size={24} color="#f0f0f0" weight="bold" />
      
      }
      </div>

      {visible &&
        <div className="aih-actions-background">
          <div className="aih-actions-block">

            <div className="aih-actions-column herd-actions-column">
              <div className="aih-actions-column-title">ЖИВОТНЫЕ</div>

              {animal.gender === 'female' &&
                <Link to={`/herd/lactation/${animal._id}`} className="aih-actions-item">
                  <div className="aih-actions-item-mark"></div>
                  <img src={`${process.env.PUBLIC_URL}/img/custom-svgs/lactation.svg`} />
                  <div className="aih-actions-item-title">Лактация</div>
                </Link>
              }
              {animal.gender === 'female' && animal.lactations?.length > 0 &&
                <Link to={`/herd/milking/${animal._id}`} className="aih-actions-item">
                  <div className="aih-actions-item-mark"></div>
                  <img src={`${process.env.PUBLIC_URL}/img/svgs/drop.svg`} />
                  <div className="aih-actions-item-title">Результат доения</div>
                </Link>
              }

              <Link to={`/herd/weight/${animal._id}`} className="aih-actions-item">
                <div className="aih-actions-item-mark"></div>
                <img src={`${process.env.PUBLIC_URL}/img/images/weight-icon.png`} />
                <div className="aih-actions-item-title">Взвешивание</div>
              </Link>


            </div>

          </div>
        </div>
      }

    </div>
  );
}

export default CardActionsMenu;