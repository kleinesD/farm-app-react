import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

interface LactationsProps {
  animal: any
}

const Lactations: React.FC<LactationsProps> = ({ animal }) => {
  const [lactations, setLactations] = useState<any[]>([]);

  useEffect(() => {
    let max = 0;

    animal.lactations.forEach((lact: any) => {
      const days = lact.finishDate ?
      Math.round((new Date(lact.finishDate).getTime() - new Date(lact.startDate).getTime()) / 1000 / 60 / 60 / 24)
      :
      Math.round((new Date().getTime() - new Date(lact.startDate).getTime()) / 1000 / 60 / 60 / 24)
    
      lact.days = days;

      if(days <= 305) lact.color = '#d9d9d9';
      if(days > 305 && days <= 365) lact.color = '#f6b91d';
      if(days > 365) lact.color = '#d44d5c';

      if(max < days) max = days;
    });

    animal.lactations.forEach((lact: any) => {
      lact.comparedLength = lact.days / (max / 100);
    }); 

    setLactations(animal.lactations?.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
  }, [animal]);

  

  return (
    <div className="ac-lactations-info">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Лактации</div>
      </div>

      {lactations.length > 0 && !lactations.at(-1).finishdate &&
        <div className="current-animal-info-block">
          <div className="cai-item cai-item-row">
            <div className="current-lact-mark">
              <div className="current-lact-mark-inner"></div>
            </div>
            <div className="current-lact-text">Текущая лактация</div>
          </div>

          <div className="cai-item">
            <div className="cai-item-title">#{lactations.at(-1).number}</div>
            <div className="cai-item-text">Номер</div>
          </div>
          <div className="cai-item">
            <div className="cai-item-title">{moment(lactations.at(-1).startDate).locale('ru').format('DD MMMM YYYY')}</div>
            <div className="cai-item-text">Начало</div>
          </div>
          <div className="cai-item">
            <div className="cai-item-title">{Math.round((new Date().getTime() - new Date(lactations.at(-1).startDate).getTime()) / 1000 / 60 / 60 / 24)}</div>
            <div className="cai-item-text">День</div>
          </div>
          <div className="cai-item">
            <Link className="cai-item-btn" to={`/herd/lactation/${animal._id}/?edit=true&id=${lactations.at(-1)._id}`}>Окончить лактацию</Link>
          </div>
        </div>
      }

      <div className="lact-comp-container">
        {lactations.map((lact: any, index: number) => (
          <div key={index} className="lact-comp-item" style={{width: `${50 + lact.comparedLength / 2}%`}}>
            <div className="lact-comp-number">#{lact.number}</div>
            <div className="lact-comp-body">
              <div className="lact-text-line">
                <p className="start">{moment(lact.startDate).locale('ru').format('DD MMMM YYYY')}</p>
                <p className="day">{lact.finishDate ?
                  Math.round((new Date(lact.finishDate).getTime() - new Date(lact.startDate).getTime()) / 1000 / 60 / 60 / 24)
                  :
                  Math.round((new Date().getTime() - new Date(lact.startDate).getTime()) / 1000 / 60 / 60 / 24)
                } дн.</p>
                <p className="finish">{lact.finishDate ? moment(lact.finishDate).locale('ru').format('DD MMMM YYYY') : ''}</p>
              </div>

              <div className="lact-visual-line" style={{backgroundColor: `${lact.color}`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Lactations;