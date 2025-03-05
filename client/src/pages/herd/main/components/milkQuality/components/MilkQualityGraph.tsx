import React, { useEffect, useState } from "react";
import moment from "moment";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Text } from '@visx/text';

interface MilkQualityGraphProps {
  records: any[],
  type: string
}

const MilkQualityGraph: React.FC<MilkQualityGraphProps> = ({ records, type }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const dataBuf: any[]  = [];

    records.map((rec: any) => {
      if (!rec[type]) return;

      dataBuf.push({ value: rec[type], date: new Date(rec.date) }); 
    });

    setData(dataBuf);
  }, [records, type]);

  // Define the range (size of the chart)
  const container = document.querySelector('.milk-quality-graph') as HTMLElement;

  const width = data.length * 200 + 200;
  const height = container ? container.offsetHeight : 500;

  if (data.length === 0) return;

  let min = 100;
  let max = 0;

  data.forEach((rec: any) => {
    if (rec.value > max) max = rec.value;
    if (rec.value < min) min = rec.value;
  });

  const xScale = scaleTime({
    domain: [data[0].date, data?.at(-1)!.date],
    range: [100, width - 150],
  });

  const yScale = scaleLinear({
    domain: [min * 0.9, max * 1.1], // Data range (min and max y values)
    range: [height - 10, 10], // Flip so larger values are at the top
  });

  return (
    <svg width={width} height={height} style={{position: 'absolute', left: '0', top: '0'}}>

      <LinePath
        data={data}
        x={(d: any) => xScale(d.date)}
        y={(d: any) => yScale(d.value)}
        stroke="#d9d9d9"
        strokeWidth={2}
      />

      {data.map((point: any, index: number) => (
        <React.Fragment key={index}>
          <Text
            x={xScale(point.date)}
            y={yScale(point.value)}
            textAnchor="middle"
            dy={-15}
            className="basic-graph-text"
          >
            {`${point.value}%`}
          </Text>
          <Text
            x={xScale(point.date)}
            y={height - 30}
            textAnchor="middle"
            className="basic-graph-text-date"
          >
            {`${moment(point.date).locale('ru').format('DD MMMM, YYYY').toUpperCase()}`}
          </Text>
        </React.Fragment>
      ))}
    </svg>
  )
};

export default MilkQualityGraph;