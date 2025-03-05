import React, { useState, useEffect } from "react";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath, Circle } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { Tooltip, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import moment from "moment";

interface MRGraphProps {
  data: any,
  type: string
}

const MRGraph: React.FC<MRGraphProps> = ({ data, type }) => {
  const [point, setPoint] = useState<any>(null);


  // Define the range (size of the chart)
  const container = document.querySelector('.mp-herd-graph-container') as HTMLElement;

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


  const xScale = scaleTime({
    domain: [data[0].date, data?.at(-1)!.date],
    range: [10, width - 10],
  });

  let max = 25;

  data.forEach((item: any) => {
    if (item.value > max) max = item.value;
  });

  const yScale = scaleLinear({
    domain: [0, max + max * 0.1], // Data range (min and max y values)
    range: [height - 10, 10], // Flip so larger values are at the top
  });

  const handleTooltip = (event: React.MouseEvent<SVGCircleElement>, selectedPoint: any) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    setPoint({ rect, point: selectedPoint });
    showTooltip({
      tooltipData: selectedPoint,
      tooltipLeft: xScale(selectedPoint.date),
      tooltipTop: rect.top + yScale(selectedPoint.value),
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
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} className="mp-graph-tooltip">

          {type === 'average' && (
            <React.Fragment>
              <div className="mp-graph-tooltip-sub-res">{tooltipData.value} л.</div>
              <div className="mp-graph-tooltip-title">Средний результат</div>
              <div className="mp-graph-tooltip-gap"></div>
              <div className="mp-graph-tooltip-sub-res">{tooltipData.subValue} л.</div>
              <div className="mp-graph-tooltip-title">Всего молока в день</div>
            </React.Fragment>
          )}
          {type === 'total' && (
            <React.Fragment>
              <div className="mp-graph-tooltip-sub-res">{tooltipData.value} л.</div>
              <div className="mp-graph-tooltip-title">Всего молока в день</div>
              <div className="mp-graph-tooltip-gap"></div>
              <div className="mp-graph-tooltip-sub-res">{tooltipData.subValue} л.</div>
              <div className="mp-graph-tooltip-title">Средний результат</div>
            </React.Fragment>
          )}

          
          <div className="mp-graph-tooltip-sub-res">{tooltipData.counter}</div>
          <div className="mp-graph-tooltip-title">Всего результатов</div>
          <div className="mp-graph-tooltip-date">{moment(tooltipData.date).locale('ru').format('MMMM YYYY').toUpperCase()}</div>

        </TooltipInPortal>
      )}
    </svg>
  )

}

export default MRGraph;