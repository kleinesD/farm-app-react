import React, { useEffect, useState } from "react";
import moment from "moment";

interface WrriteOffSuggestionsProps {
  animals: any[]
}

const WrriteOffSuggestions: React.FC<WrriteOffSuggestionsProps> = ({ animals }) => {
  const [sortedAnimals, setSortedAnimals] = useState<any[]>([]);

  useEffect(() => {
    const animalsArr: any[] = [];
    animals.forEach((anim: any) => {
      let dueMonth = moment(anim.birthDate).diff(moment(), 'month');
      if (anim.gender === 'female') dueMonth = dueMonth + 72;
      else dueMonth = dueMonth + 24;

      if (dueMonth <= 0) dueMonth = 0;

      const existingMonth = animalsArr.find((item: any) => item.due === dueMonth);

      if (existingMonth) {
        existingMonth[anim.gender].push(anim);
      } else {
        const male: any[] = [];
        const female: any[] = [];

        if (anim.gender === 'male') male.push(anim);
        if (anim.gender === 'female') female.push(anim);

        animalsArr.push({ due: dueMonth, male, female });
      }
    });

    animalsArr.sort((a: any, b: any) => a.due - b.due);
    setSortedAnimals(animalsArr);
  }, [animals]);


  return (
    <div className="herd-slaughter-block">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Животные на забой</div>
      </div>

      <div className="sb-info-text">Критерии для отбора: быки старше 2-х лет, коровы старше 6-ти лет</div>

      <div className="sb-container">

        {sortedAnimals.map((item: any, index: number) => (
          <div className={`sb-item ${item.due === 0 ? 'sb-item-ready' : ''}`} key={index}>
            {item.female.length > 0 &&
              <div className="sb-item-top">
                <div className="b-text">{item.female.length}</div>
                <div className="s-text">{item.due > 0 ?`КОРОВ БУДУТ ГОТОВЫ ДЛЯ ЗАБОЯ ЧЕРЕЗ`: 'КОРОВ ГОТОВЫ ДЛЯ ЗАБОЯ'} </div>
                <img src={`${process.env.PUBLIC_URL}/img/icons/herd-cow.png`} />
              </div>
            }

            {item.male.length > 0 &&
              <div className="sb-item-top">
                <div className="b-text">{item.male.length}</div>
                <div className="s-text">{item.due > 0 ?`БЫКОВ БУДУТ ГОТОВЫ ДЛЯ ЗАБОЯ ЧЕРЕЗ`: 'БЫКОВ ГОТОВЫ ДЛЯ ЗАБОЯ'} </div>
                <img src={`${process.env.PUBLIC_URL}/img/icons/herd-bull.png`} />
              </div>
            }

            {item.due > 0 ?
              <div className="sb-item-bottom">
                <div className="b-text">{item.due}</div>
                <div className="s-text">МЕС.</div>
              </div>
              :
              <div className="sb-item-bottom">
                <div className="b-text"></div>
                <div className="s-text"></div>
              </div>

            }
          </div>
        ))}

      </div>
    </div>
  )
}

export default WrriteOffSuggestions;