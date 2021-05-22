import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { useChartMetadata } from '../hooks/useChartMetadata';
import {
  getOpenTime,
  getOpen,
  getClose,
  getHigh,
  getLow,
  candleWidth,
  margin,
} from '../helpers/candlestickHelper';

export function D3Candlestick({ data: originalData }) {
  const [isGraphInitialized, setIsGraphInitialized] = useState(false);
  const [svg, setSvg] = useState(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const chartAreaRef = useRef(null);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setSvg(d3.select(node));
    }
  }, []);

  const metadata = useChartMetadata(svg, originalData);
  const shouldRender = useMemo(
    () => svg && originalData && metadata,
    [svg, originalData, metadata]
  );

  useEffect(() => {
    if (shouldRender && !isGraphInitialized) {
      console.log('initializing chart');
      setIsGraphInitialized(true);
      const { width, height, timeScale, priceScale } = metadata;

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      chartAreaRef.current = g;

      const xAxis = d3.axisBottom().scale(timeScale);
      const yAxis = d3.axisRight().scale(priceScale).tickSize(-width);

      xAxisRef.current = g
        .append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${height})`);

      yAxisRef.current = g
        .append('g')
        .call(yAxis)
        .attr('transform', `translate(${width}, 0)`);
    }
  }, [isGraphInitialized, originalData, svg, metadata, shouldRender]);

  useEffect(() => {
    if (isGraphInitialized && shouldRender) {
      console.log('updating chart');
      const { width, timeScale, priceScale } = metadata;

      xAxisRef.current
        .transition()
        .duration(1000)
        .call(d3.axisBottom().scale(timeScale));

      yAxisRef.current
        .transition()
        .duration(1000)
        .call(d3.axisRight().scale(priceScale).tickSize(-width));

      const temp = chartAreaRef.current
        .selectAll('.candle')
        .data(originalData, (d) => getClose(d) - getOpen(d));

      const candles = temp
        .enter()
        .append('g')
        .classed('candle', true)
        .merge(temp)
        .attr('transform', (d) => {
          const x = timeScale(getOpenTime(d)) - candleWidth / 2;
          const y = priceScale(Math.max(getOpen(d), getClose(d)));

          return `translate(${x}, ${y})`;
        });

      temp.exit().remove();

      candles
        .append('rect')
        .merge(temp)
        .attr('width', 5)
        .attr('height', (d) => {
          const candleHeight = Math.abs(
            priceScale(getClose(d)) - priceScale(getOpen(d))
          );
          return candleHeight;
        })
        .attr('fill', (d) => (getOpen(d) > getClose(d) ? 'red' : 'green'));

      candles
        .append('line')
        .attr('stroke', (d) => (getOpen(d) > getClose(d) ? 'red' : 'green'))
        .attr('x1', candleWidth / 2)
        .attr('x2', candleWidth / 2)
        .attr('y1', (d) => {
          const candleHeadWick =
            priceScale(getHigh(d)) -
            priceScale(Math.max(getOpen(d), getClose(d)));
          return candleHeadWick;
        })
        .attr('y2', (d) => {
          const candleTailWick =
            priceScale(getLow(d)) -
            priceScale(Math.max(getOpen(d), getClose(d)));
          return candleTailWick;
        });
    }
  }, [isGraphInitialized, originalData, metadata, svg, shouldRender]);

  return (
    <svg className="container" width={700} height={500} ref={measuredRef} />
  );
}
