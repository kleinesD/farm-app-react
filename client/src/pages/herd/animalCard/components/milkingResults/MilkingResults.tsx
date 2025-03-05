import moment from "moment";
import React, { useState, useEffect } from "react";
import MRGraph from "./MRGraph";

interface MilkingResultsProps {
  animal: any
}

const MilkingResults: React.FC<MilkingResultsProps> = ({ animal }) => {
  const [milkingResults, setMilkingResults] = useState<any[]>([]);

  useEffect(() => {
    setMilkingResults(animal.milkingResults.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()));

  }, [animal]);

  return (
    <div className="animal-card-graph-block">

      <MRGraph animal={animal}></MRGraph>

      <div className="ac-results-block">
        {milkingResults.map((res: any, index, arr) => {
          const lactation = animal.lactations.find((lact: any) => lact.number === res.lactationNumber);

          if (index === 0 || res.lactationNumber !== arr[index - 1].lactationNumber) {

            return (
              <React.Fragment key={index}>
                <div className="ac-rb-title">Лактация #{res.lactationNumber}</div>

                <div className="ac-rb-result" key={index}>
                  <div className="ac-rb-icon">Р</div>
                  <div className="ac-rb-date">{moment(res.date).locale('ru').format('DD.MM.YYYY')} ( {Math.round((new Date(res.date).getTime() - new Date(lactation.startDate).getTime()) / 1000 / 60 / 60 / 24)} день )</div>
                  <div className="ac-rb-text">{res.result} л.</div>
                </div>
              </React.Fragment>
            )
          }

          return (
            <div className="ac-rb-result" key={index}>
              <div className="ac-rb-icon">Р</div>
              <div className="ac-rb-date">{moment(res.date).locale('ru').format('DD.MM.YYYY')} ( {Math.round((new Date(res.date).getTime() - new Date(lactation.startDate).getTime()) / 1000 / 60 / 60 / 24)} день )</div>
              <div className="ac-rb-text">{res.result} л.</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MilkingResults