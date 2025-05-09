import React, { useState, useEffect } from "react";
import useProjection from "./hooks/useProjection";
import moment from "moment";
import useFormatProjections from "./hooks/useFormatProjection";

interface HerdProjectionProps {
  animals: any[]
};

const HerdProjection: React.FC<HerdProjectionProps> = ({ animals }) => {
  const [projData, setProjData] = useState<any[]>([]);
  const [detailsVis, setDetailsVis] = useState<boolean>(false);
  const [year, setYear] = useState<number>(5);
  const [category, setCategory] = useState<string>('animals');

  const projectionYears = useProjection(animals, 5);

  useEffect(() => {
    const storedData = localStorage.getItem('herdProjection');
    const prevProj = storedData ? JSON.parse(storedData) : null;

    if (prevProj && projectionYears[0].animals.length === prevProj[0].animals.length) {
      setProjData(prevProj)
    } else {
      setProjData(projectionYears);
      localStorage.setItem('herdProjection', JSON.stringify(projectionYears));
    }
  }, [animals]);

  const {projDataFormat, maxes} = useFormatProjections(projData);

  const currentYear = projDataFormat.find((item: any) => item.year === year);

  const changeCategory = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (!target) return;

    const category = target.getAttribute('data-category');

    if (!category) return;

    setCategory(category);
  }

  const changeYear = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (!target) return;

    const year = target.getAttribute('data-year');

    if (!year) return;

    setYear(parseFloat(year));
  }



  return (
    <div className="mp-projection-block">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Прогноз изменения поголовья на следующие 5 лет</div>

        <div className="mp-block-outside-header-btn-block">
          <div className={`mp-block-outside-header-btn mp-block-outside-header-btn-active`} onClick={() => setDetailsVis(!detailsVis)}>{detailsVis ? 'Скрыть' : 'Подробнее'}</div>
        </div>
      </div>

      {detailsVis &&
        <div className="mp-detail-text-block">
          <div className="mp-detail-text-title">ОСНОВАНО НА:</div>
          <div className="mp-detail-text-sub-title">Данная проекция изменения поголовья стада основана на средне статистических данных полученных в открытом доступе.</div>
          <div className="mp-detail-text-text">
            Каждый год из-за болезней списывается
            <span>1.67% </span>
            животных.
          </div>
          <div className="mp-detail-text-text">
            Каждая корова телится с переодичностью в
            <span>13 </span>
            месяцев.
          </div>
          <div className="mp-detail-text-text">
            При рождении или в первые несколько месяцев
            <span>12% </span>
            телят умирает.
          </div>
          <div className="mp-detail-text-text">
            Быки после
            <span>2 </span>
            лет, а коровы после
            <span>6 </span>
            списываются на забой.
          </div>
        </div>
      }

      {currentYear &&
        <div className="mp-projection-info-block">

          <div className={`mp-projection-info-item mp-projection-info-item-animals ${category !== 'animals' ? 'mp-projection-info-item-transp' : ''}`} data-category='animals' onClick={changeCategory}>
            <div className="mp-projection-info-item-res">{currentYear.animals.count}</div>
            <div className="mp-projection-info-item-title">
              ВСЕГО ЖИВОТНЫХ
              <span className={`${currentYear.animals.change >= 0 ? 'span-success' : 'span-fail'}`}>{currentYear.animals.change >= 0 ? '+' : '-'}{currentYear.animals.change}</span>
            </div>
            <img className="mp-projection-image" src={`${process.env.PUBLIC_URL}/img/icons/herd-animal.png`} />
          </div>

          <div className={`mp-projection-info-item mp-projection-info-item-cows ${category !== 'cows' ? 'mp-projection-info-item-transp' : ''}`} data-category='cows' onClick={changeCategory}>
            <div className="mp-projection-info-item-res">{currentYear.cows.count}</div>
            <div className="mp-projection-info-item-title">
              КОРОВЫ
              <span className={`${currentYear.cows.change >= 0 ? 'span-success' : 'span-fail'}`}>{currentYear.cows.change >= 0 ? '+' : '-'}{currentYear.cows.change}</span>
            </div>
            <img className="mp-projection-image" src={`${process.env.PUBLIC_URL}/img/icons/herd-cow.png`} />
          </div>

          <div className={`mp-projection-info-item mp-projection-info-item-bulls ${category !== 'bulls' ? 'mp-projection-info-item-transp' : ''}`} data-category='bulls' onClick={changeCategory}>
            <div className="mp-projection-info-item-res">{currentYear.bulls.count}</div>
            <div className="mp-projection-info-item-title">
              БЫКИ
              <span className={`${currentYear.bulls.change >= 0 ? 'span-success' : 'span-fail'}`}>{currentYear.bulls.change >= 0 ? '+' : '-'}{currentYear.bulls.change}</span>
            </div>
            <img className="mp-projection-image" src={`${process.env.PUBLIC_URL}/img/icons/herd-bull.png`} />
          </div>

          <div className={`mp-projection-info-item mp-projection-info-item-milkingCows ${category !== 'milkingCows' ? 'mp-projection-info-item-transp' : ''}`} data-category='milkingCows' onClick={changeCategory}>
            <div className="mp-projection-info-item-res">{currentYear.milkingCows.count}</div>
            <div className="mp-projection-info-item-title">
              ДОЯЩИЕСЯ КОРОВЫ
              <span className={`${currentYear.milkingCows.change >= 0 ? 'span-success' : 'span-fail'}`}>{currentYear.milkingCows.change >= 0 ? '+' : '-'}{currentYear.milkingCows.change}</span>
            </div>
            <img className="mp-projection-image" src={`${process.env.PUBLIC_URL}/img/icons/herd-milking-cow.png`} />
          </div>

          <div className={`mp-projection-info-item mp-projection-info-item-writeOff ${category !== 'writeOff' ? 'mp-projection-info-item-transp' : ''}`} data-category='writeOff' onClick={changeCategory}>
            <div className="mp-projection-info-item-res">{currentYear.writeOff.count}</div>
            <div className="mp-projection-info-item-title">
              СПИСАНО ЖИВОТНЫХ
              <span className={`${currentYear.writeOff.change >= 0 ? 'span-success' : 'span-fail'}`}>{currentYear.writeOff.change >= 0 ? '+' : '-'}{currentYear.writeOff.change}</span>
            </div>
            <img className="mp-projection-image" src={`${process.env.PUBLIC_URL}/img/icons/herd-ready-bull.png`} />
          </div>

        </div>
      }

      <div className="mp-projection-graph" onMouseLeave={() => setYear(5)}>
        <div className="mp-projection-graph-working-area">
          {projDataFormat.map((data: any, index: number) => {
            if (data.year === 0) return;

            return (
              <div className="mp-projection-graph-item" key={index} onMouseEnter={changeYear} data-year={data.year}>
                <div className="mp-projection-graph-item-title">{data.year} г.</div>
                <div className="mp-projection-graph-item-bar">
                  <div className="mp-projection-graph-item-bar-inside" style={{height: `${data[category].count / (maxes[category] / 100)}%`}}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
};

export default HerdProjection;