import moment from "moment";
import React, { useEffect, useState } from "react";

interface WeightResultsProps {
  animal: any
}

const WeightResults: React.FC<WeightResultsProps> = ({ animal }) => {
  const [weights, setWeights] = useState<any[]>([]);

  useEffect(() => {
    let max = 0;

    animal.weightResults.forEach((res: any) => {
      if (max < res.result) max = res.result;
    });

    animal.weightResults.forEach((res: any) => {
      res.comparedWeight = res.result / (max / 100);
    });

    setWeights(animal.weightResults?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [animal]);

  return (
    <div className="ac-weight-info-block">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Взвешивание</div>
      </div>

      <div className="ac-current-weight-block">
        <div className="ac-current-weight">{animal.weightResults.at(-1)?.result}</div>
        <div className="ac-current-weight-sub">кг.</div>
      </div>

      <div className="ac-all-weights-block">
        {weights.map((res: any, index: number) => (
          <div className="ac-all-weight" key={index} style={{height: `calc(${res.comparedWeight}% - 20px)`}}>
            <div className="ac-all-weight-date">{moment(res.date).locale('ru').format('DD MMMM, YYYY').toUpperCase()}</div>
            <div className="ac-all-weight-res">{res.result} КГ.</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeightResults;