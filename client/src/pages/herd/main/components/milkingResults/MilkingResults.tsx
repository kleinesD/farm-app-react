import React, { useState, useEffect } from "react";
import moment from "moment";
import { Infinity } from "@phosphor-icons/react";
import MRGraph from "./MRGraph";
import EmptyBlock from "../../../../../components/otherComponents/EmptyBlock";

interface MilkingResultsProps {
  animals: any[]
}

const MilkingResults: React.FC<MilkingResultsProps> = ({ animals }) => {
  const [type, setType] = useState<string>('average');
  const [period, setPeriod] = useState<number | string>(6);
  const [data, setData] = useState<any[]>([]);
  const [buttons, setButtons] = useState<any[]>([]);
  const [allResults, setAllResults] = useState<any[]>([]);

  useEffect(() => {
    const possibleButtons = [6, 12, 24, 60, 'all'];

    possibleButtons.forEach((btn: any) => {
      let results: any = [];
      animals.forEach((anim: any) => {
        anim.milkingResults.forEach((res: any) => {
          if (btn === 'all' || new Date(res.date) >= moment().subtract(btn, 'month').toDate()) {
            results.push(res);
          }
        })
      });

      if (results.length > 5) setButtons((prev: any) => !prev.includes(btn) ? [...prev, btn] : prev);
    });

  }, [animals]);

  useEffect(() => {
    if (buttons.length > 0) {
      setPeriod(buttons[0]);
    }
  }, [buttons]);

  const typeChange = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (!target) return;

    const value = target.getAttribute('data-value');

    if (!value || !['average', 'total'].includes(value)) return;

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

  useEffect(() => {
    let results: any = [];
    animals.forEach((anim: any) => {
      anim.milkingResults.forEach((res: any) => {
        const result = {
          ...res,
          number: anim.number,
          name: anim.name ? anim.name : '',
        }

        setAllResults((prev: any) => !prev.find((pr: any) => pr._id === result._id) ? [...prev, result].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) : prev);

        if (period === 'all' || new Date(res.date) >= moment().subtract(period, 'month').toDate()) {
          results.push(res);
        }
      })
    });


    let sortedResults: any = []

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
        value: type === 'average' ? parseFloat((res.average).toFixed(1)) : res.total,
        subValue: type === 'total' ? parseFloat((res.average).toFixed(1)) : res.total,
        counter: res.counter
      }
    }))
  }, [type, period])


  if (buttons.length === 0) return;

  return (
    <div className="mp-herd-graph-block">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Результаты доения</div>
      </div>

      <div className="mp-herd-graph-container">
        <div className="mp-hg-btn-block mp-hg-btn-block-1 graph-btns">
          <div className={`mp-hg-btn ${type === 'average' ? 'mp-hg-btn-active' : ''}`} data-value="average" onClick={typeChange}>Средний</div>
          <div className={`mp-hg-btn ${type === 'total' ? 'mp-hg-btn-active' : ''}`} data-value="total" onClick={typeChange}>Всего</div>
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

        {data.length > 0 && <MRGraph data={data} type={type} />}

      </div>

      <div className="mp-herd-graph-info-block">
        <div className="mp-herd-graph-info-block-inner">
          {allResults.map((res: any, index: number) => (
            <div key={index} className="mp-herd-graph-info-item" data-qt={`${moment(res.date).locale('ru').format('DD MMMM, YY')}`}>
              <div className="mp-herd-graph-info-item-group">
                <div className="mp-herd-graph-info-text">#{res.number}</div>
                <div className="mp-herd-graph-info-sub-text">{res.name}</div>
              </div>

              <div className="mp-herd-graph-info-item-group">
                <div className="mp-herd-graph-info-text">{res.result}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MilkingResults;