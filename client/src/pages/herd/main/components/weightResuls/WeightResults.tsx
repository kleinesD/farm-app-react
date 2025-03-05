import React, { useState, useEffect } from "react";
import moment from "moment";
import { Infinity } from "@phosphor-icons/react";
import AverageGraph from "./components/AverageGraph";
import CompareGraph from "./components/CompareGraph";

interface WeightResultsProps {
  animals: any[]
}

const WeightResults: React.FC<WeightResultsProps> = ({ animals }) => {
  const [type, setType] = useState<string>('average');
  const [period, setPeriod] = useState<string | number>(6);
  const [data, setData] = useState<any[]>([]);
  const [buttons, setButtons] = useState<any[]>([]);
  const [allResults, setAllResults] = useState<any[]>([]);

  useEffect(() => {
    const possibleButtons = [6, 12, 24, 60, 'all'];

    possibleButtons.forEach((btn: any) => {
      let results: any = [];
      animals.forEach((anim: any) => {
        anim.weightResults.forEach((res: any) => {
          if (btn === 'all' || new Date(res.date) >= moment().subtract(btn, 'month').toDate()) {
            results.push(res);
          }
        })
      });

      if (results.length > 5) setButtons((prev: any) => !prev.includes(btn) ? [...prev, btn] : prev);
    });

    animals.forEach((anim: any) => {
      if (anim.weightResults.length === 0) return;

      anim.weightResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setAllResults((prev: any) => {
        if (prev.find((prevAnim: any) => anim._id === prevAnim._id)) return prev;

        const animal = {
          ...anim,
          currentWeightResult: anim.weightResults[0].result,
          currentWeightDate: new Date(anim.weightResults[0].date),
        }
        return [...prev, animal];
      });
    });

  }, [animals]);

  useEffect(() => {
    if (buttons.length > 0) {
      setPeriod(buttons[0]);
    }
  }, [buttons]);

  useEffect(() => {
    const results: any[] = [];

    animals.forEach((anim: any) => {
      anim.weightResults.forEach((res: any) => {
        const result = {
          ...res,
          number: anim.number,
          name: anim.name ? anim.name : '',
          gender: anim.gender
        }

        if (period === 'all' || new Date(res.date) >= moment().subtract(period, 'month').toDate()) {
          results.push(result)
        }
      });
    });

    if (type === 'average') {

      const sortedResults: any[] = [];

      results.forEach((res: any) => {
        const existingRes = sortedResults.find((sr: any) => moment(sr.date).isSame(res.date, 'month'));

        if (!existingRes) {
          sortedResults.push({
            date: new Date(res.date),
            average: res.result,
            total: res.result,
            counter: 1,
            results: [res]
          })
        } else {
          existingRes.results.push(res);
          existingRes.total += res.result;
          existingRes.average = existingRes.total / existingRes.results.length;
          existingRes.counter++;
        }
      });

      setData(sortedResults.sort((a: any, b: any) => a.date - b.date).map((res: any) => {
        return {
          date: res.date,
          value: Math.round(res.average),
          counter: res.counter
        }
      }))
    }
    if (type === 'compare') {
      const sortedResults: { male: any[], female: any[] } = { male: [], female: [] };

      results.forEach((res: any) => {
        let gender: 'male' | 'female';
        if (res.gender === 'male') {
          gender = 'male';
        } else {
          gender = 'female';

        }
        const existingRes = sortedResults[gender].find((sr: any) => moment(sr.date).isSame(res.date, 'month'));

        if (!existingRes) {
          sortedResults[gender].push({
            date: new Date(res.date),
            average: res.result,
            total: res.result,
            counter: 1,
            results: [res]
          })
        } else {
          existingRes.results.push(res);
          existingRes.total += res.result;
          existingRes.average = existingRes.total / existingRes.results.length;
          existingRes.counter++;
        }
      });

      sortedResults.male.sort((a: any, b: any) => a.date - b.date);
      sortedResults.female.sort((a: any, b: any) => a.date - b.date);

      setData([sortedResults.male.map((res: any) => {
        return {
          date: res.date,
          value: Math.round(res.average),
          counter: res.counter
        }
      }), sortedResults.female.map((res: any) => {
        return {
          date: res.date,
          value: Math.round(res.average),
          counter: res.counter
        }
      })])
    }

  }, [type, period]);


  const typeChange = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (!target) return;

    const value = target.getAttribute('data-value');

    if (!value || !['average', 'compare'].includes(value)) return;

    setType(value);
  }
  const periodChange = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (!target) return;

    const value = target.getAttribute('data-value');

    if (!value || !['6', '12', '24', '60', 'all'].includes(value)) return;

    const correctValue = isNaN(parseFloat(value)) ? value : parseFloat(value);

    setPeriod(correctValue);
  }

  if(buttons.length === 0) return;

  return (
    <div className="weight-graph-block">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Взвешивания</div>
      </div>

      <div className="weight-graph-container">
        <div className="mp-hg-btn-block mp-hg-btn-block-1 graph-btns">
          <div className={`mp-hg-btn ${type === 'average' ? 'mp-hg-btn-active' : ''}`} data-value="average" onClick={typeChange}>Средний</div>
          <div className={`mp-hg-btn ${type === 'compare' ? 'mp-hg-btn-active' : ''}`} data-value="compare" onClick={typeChange}>Сравнение</div>
        </div>

        <div className="mp-hg-btn-block mp-hg-btn-block-2 months-btns">
          <div className={`mp-hg-btn ${period === 6 ? 'mp-hg-btn-active' : ''} ${!buttons.includes(6) ? 'mp-hg-btn-unav' : ''}`} data-value="6" onClick={periodChange}>6м</div>
          <div className={`mp-hg-btn ${period === 12 ? 'mp-hg-btn-active' : ''} ${!buttons.includes(12) ? 'mp-hg-btn-unav' : ''}`} data-value="12" onClick={periodChange}>12м</div>
          <div className={`mp-hg-btn ${period === 24 ? 'mp-hg-btn-active' : ''} ${!buttons.includes(24) ? 'mp-hg-btn-unav' : ''}`} data-value="24" onClick={periodChange}>24м</div>
          <div className={`mp-hg-btn ${period === 60 ? 'mp-hg-btn-active' : ''} ${!buttons.includes(60) ? 'mp-hg-btn-unav' : ''}`} data-value="60" onClick={periodChange}>5г</div>
          <div className={`mp-hg-btn ${period === 'all' ? 'mp-hg-btn-active' : ''} ${!buttons.includes('all') ? 'mp-hg-btn-unav' : ''}`} data-value="all" onClick={periodChange}>
            {period !== 'all'
              ?
              <Infinity size={16} color="#0a0a0a" weight="bold" />
              :
              <Infinity size={16} color="#f0f0f0" weight="bold" />
            }
          </div>
        </div>

        {(type === 'average' && data.length > 5) && <AverageGraph data={data} />}

        {(type === 'compare' && (data[0].length > 0 || data[1].length > 0)) && <CompareGraph data={data} />}


      </div>

      <div className="weight-results-block">
        {allResults.map((animal: any, index: number) => (
          <div key={index} className={`wrb-item-outter ${animal.butcherSuggestion ? 'wrb-item-outter-ready' : ''}`} data-rcm-title="Списать животное" data-rcm-link={`/herd/write-off-animal/?animals=${animal.number}`} data-qt={`Текущий вес на ${moment(animal.currentWeightDate).locale('ru').format('DD.MM.YYYY')}`}>
            <div className="wrb-item" >
              <div className="wrb-item-image"> <img src={`${process.env.PUBLIC_URL}/img/images/default-cow-image.png`} /></div>
              <div className="wrb-item-text">#{animal.number}</div>
              <div className="wrb-item-text wrb-item-res">{animal.currentWeightResult} кг.</div>
            </div>
            {animal.butcherSuggestion ? <div className="wrb-item-disclaimer">{animal.gender === 'male' ? 'Бык готов' : 'Корова готова'} для забоя</div> : ''}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeightResults;