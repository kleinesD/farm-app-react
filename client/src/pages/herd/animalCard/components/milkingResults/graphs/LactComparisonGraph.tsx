import React, { useState, useEffect } from "react";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath, Circle } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { Tooltip, useTooltip, useTooltipInPortal } from "@visx/tooltip";


interface LactComparisonGraphProps {
  results: any
}

const LactComparisonGraph: React.FC<LactComparisonGraphProps> = ({ results }) => {
  const [point, setPoint] = useState<any>(null);


  // Define the range (size of the chart)
  const container = document.querySelector('.animal-card-graph-page') as HTMLElement;

  const width = container ? container.offsetWidth : 500;
  const height = container ? container.offsetHeight : 500;

  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } = useTooltip<any>();

  useEffect(() => {
    if (point !== null) {
      showTooltip({
        tooltipData: point.point,
        tooltipLeft: xScale(point.point.point.x),
        tooltipTop: point.rect.top + yScale(point.point.point.y) - 50,
      });
    }

  }, [point]);

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const data = results.map((lact: any) => {
    const updatedResults = lact.results.map((res: any) => { return { x: res.month, y: res.result } });

    return { lactation: lact.lactation, results: updatedResults };
  });

  let max = 10;

  data.forEach((lact: any) => {
    lact.results.forEach((res: any) => {
      if (res.x > max) max = res.x;
    })
  });


  if (data.length === 0) return;

  const xScale = scaleLinear({
    domain: [0, max],
    range: [10, width - 10],
  });

  const yScale = scaleLinear({
    domain: [0, 50], // Data range (min and max y values)
    range: [height - 10, 10], // Flip so larger values are at the top
  });

  const handleTooltip = (event: React.MouseEvent<SVGCircleElement>, selectedPoint: any) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    setPoint({ rect, point: selectedPoint });
    showTooltip((prev) => ({
      tooltipData: selectedPoint,
      tooltipLeft: xScale(selectedPoint.point.x),
      tooltipTop: rect.top + yScale(selectedPoint.point.y) - 50,
    }));
  }



  const hideTooltipCust = () => {
    setPoint(null);
    hideTooltip();
  }

  let colors = ['#fb8d34', '#ff5230', '#9d4b9f', '#606ae5', '#43d7e5', '#6DA34D', '#48A9A6', '#613F75', '#22333B', '#5E503F'];


  return (
    <svg width={width} height={height}>
      <GridRows scale={yScale} width={width} height={height} stroke="#d9d9d9" strokeDasharray="5, 5" />
      <GridColumns scale={xScale} width={width} height={height} stroke="#d9d9d9" strokeDasharray="5, 5" />

      {data.map((lact: any, index: number) => {

        return (
          <React.Fragment key={`lact-${index}`}>
            <LinePath
              data={lact.results}
              x={(d: any) => xScale(d.x)}
              y={(d: any) => yScale(d.y)}
              stroke={`${colors[index]}`}
              strokeWidth={2}
            />

            {lact.results.map((point: any, inx: number) => (
              <Circle
              key={`res-${inx}`}
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={3}
                fill="#f0f0f0"
                stroke={`${colors[index]}`}
                strokeWidth={2}
                onMouseEnter={(event) => handleTooltip(event, {point, lactation: lact.lactation, index})}
                onMouseLeave={hideTooltipCust}
              />
            ))}

          </React.Fragment>
        )
      })}


      {tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} className={`ac-graph-tooltip ac-graph-tooltip-${tooltipData.index}`} >

          <div className="ac-graph-tooltip-title">ЛАКТАЦИЯ:</div>
          <div className="ac-graph-tooltip-res">#{tooltipData.lactation}</div>
          <div className="ac-graph-tooltip-title">МЕСЯЦ:</div>
          <div className="ac-graph-tooltip-res">{tooltipData.point.x}</div>
          <div className="ac-graph-tooltip-title">РЕЗУЛЬТАТ:</div>
          <div className="ac-graph-tooltip-res">{tooltipData.point.y} л.</div>

        </TooltipInPortal>
      )}
    </svg>
  )
}

export default LactComparisonGraph;