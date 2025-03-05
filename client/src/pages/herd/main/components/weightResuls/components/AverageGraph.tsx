import React, { useState, useEffect } from "react";
import moment from "moment";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath, Circle } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { Tooltip, useTooltip, useTooltipInPortal } from "@visx/tooltip";

interface AverageGraphProps {
  data: any[]
}

const AverageGraph: React.FC<AverageGraphProps> = ({ data }) => {
  const [point, setPoint] = useState<any>(null);


  // Define the range (size of the chart)
  const container = document.querySelector('.weight-graph-container') as HTMLElement;

  const width = container ? container.offsetWidth : 500;
  const height = container ? container.offsetHeight : 500;

  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } = useTooltip<any>();

  useEffect(() => {
    if (point !== null) {
      showTooltip({
        tooltipData: point.point,
        tooltipLeft: xScale(point.point.date),
        tooltipTop: point.rect.top + yScale(point.point.value) - 50,
      });
    }

  }, [point]);

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  if (data.length === 0) return;

  let max = 0;
  let min = 1000;
  data.forEach((d: any) => {
    if(d.value > max) max = d.value;
    if(d.value < min) min = d.value;
  })

  const xScale = scaleTime({
    domain: [data[0].date, data?.at(-1)!.date],
    range: [20, width - 20],
  });

  const yScale = scaleLinear({
    domain: [min * 0.8, max * 1.1], // Data range (min and max y values)
    range: [height - 20, 20], // Flip so larger values are at the top
  });

  const handleTooltip = (event: React.MouseEvent<SVGCircleElement>, selectedPoint: any) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    setPoint({ rect, point: selectedPoint });
    showTooltip({
      tooltipData: selectedPoint,
      tooltipLeft: xScale(selectedPoint.date),
      tooltipTop: rect.top + yScale(selectedPoint.value) - 50,
    });
  }



  const hideTooltipCust = () => {
    setPoint(null);
    hideTooltip();
  }


  return (
    <svg width={width} height={height}>
      <GridRows scale={yScale} width={width} height={height} stroke="#d9d9d9" strokeDasharray="5, 5" />
      <GridColumns scale={xScale} width={width} height={height} stroke="#d9d9d9" strokeDasharray="5, 5" />

      <LinePath
        data={data}
        x={(d: any) => xScale(d.date)}
        y={(d: any) => yScale(d.value)}
        stroke="#fb8d34"
        strokeWidth={2}
      />

      {data.map((point: any, index: number) => (
        <Circle
          key={index}
          cx={xScale(point.date)}
          cy={yScale(point.value)}
          r={3}
          fill="#f0f0f0"
          stroke="#0a0a0a"
          strokeWidth={2}
          onMouseEnter={(event) => handleTooltip(event, point)}
          onMouseLeave={hideTooltipCust}
        />
      ))}


      {tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} className="ac-graph-tooltip">

          <div className="ac-graph-tooltip-title">СРЕДНИЙ ВЕС:</div>
          <div className="ac-graph-tooltip-res">{tooltipData.value} кг.</div>
          <div className="ac-graph-tooltip-title">ДАТА:</div>
          <div className="ac-graph-tooltip-res">{moment(tooltipData.date).locale('ru').format('MMMM YYYY').toUpperCase()}</div>

        </TooltipInPortal>
      )}
    </svg>
  )

}

export default AverageGraph;