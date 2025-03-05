import React, { useState, useEffect } from "react";
import moment from "moment";
import ResultsGraph from "./graphs/ResultsGraph";
import LactComparisonGraph from "./graphs/LactComparisonGraph";

interface MRGraphProps {
  animal: any
}

const MRGraph: React.FC<MRGraphProps> = ({ animal }) => {
  const [milkingResults, setMilkingResults] = useState<any[]>([]);
  const [milkingResultsByLact, setMilkingResultsByLact] = useState<any[]>([]);
  const [graphState, setGraphState] = useState<string>('results');

  useEffect(() => {
    setMilkingResults(animal.milkingResults.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()));

    const lactsRes: any = [];

    animal.lactations.forEach((lact: any) => {

      const results = animal.milkingResults.filter((res: any) => res.lactationNumber === lact.number);

      results.forEach((res: any) => res.month = Math.round((new Date(res.date).getTime() - new Date(lact.startDate).getTime()) / 1000 / 60 / 60 / 24 / 30));

      if(results.length === 0) return;

      results.sort((a: any, b: any) => a.month - a.month);

      lactsRes.push({lactation: lact.number, results});

    });
    setMilkingResultsByLact(lactsRes);

  }, [animal]);

  const changeState = (event: React.MouseEvent<HTMLDivElement>) => {
    const state = event.currentTarget.getAttribute('data-value');

    if (state) setGraphState(state);
  }

  return (
    <div className="animal-card-graph-page">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Результаты доения</div>
      </div>

      <div className="mp-hg-btn-block mp-hg-btn-block-2">
        <div className={`mp-hg-btn ${graphState === 'results' ? 'mp-hg-btn-active' : ''}`} data-value="results" onClick={changeState}>Результаты</div>
        <div className={`mp-hg-btn ${graphState === 'lacts' ? 'mp-hg-btn-active' : ''}`} data-value="lacts" onClick={changeState}>Сравнение по лактациям</div>
      </div>

      {graphState === 'results' &&
        <ResultsGraph results={milkingResults}></ResultsGraph>
      }
      {graphState === 'lacts' &&
        <LactComparisonGraph results={milkingResultsByLact}></LactComparisonGraph>
      }

    </div>
  )
}

export default MRGraph;