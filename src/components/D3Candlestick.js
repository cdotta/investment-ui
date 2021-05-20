import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { mockData } from './mockData';

export function D3Candlestick({ data: originalData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const data = originalData && mockData;
    if (data && containerRef.current) {
      console.log(data);
      const getOpenTime = (d) => d.openTime;
      const getOpen = (d) => +d.open;
      const getClose = (d) => +d.close;
      const svg = d3.select(containerRef.current);

      const margin = { top: 50, bottom: 50, left: 20, right: 50 };
      const containerWidth = +svg.attr('width');
      const containerHeight = +svg.attr('height');
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      const maxPrice = d3.max(data, getOpen);
      const minPrice = d3.min(data, getOpen);
      const priceExtension = (maxPrice - minPrice) * 0.1;
      const maxOpenTime = d3.max(data, getOpenTime);
      const minOpenTime = d3.min(data, getOpenTime);
      const timeExtension = (maxOpenTime - minOpenTime) * 0.1;

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create scale
      const timeScale = d3
        .scaleTime()
        .domain([minOpenTime - timeExtension, maxOpenTime + timeExtension])
        .range([0, width]);
      console.log(timeScale.domain());

      const priceScale = d3
        .scaleLinear()
        .domain([minPrice - priceExtension, maxPrice + priceExtension])
        .range([height, 0]);
      console.log(priceScale.domain());

      // Add scales to axis
      const xAxis = d3.axisBottom().scale(timeScale);

      const yAxis = d3.axisRight().scale(priceScale);

      g.append('g').call(xAxis).attr('transform', `translate(0, ${height})`);
      g.append('g').call(yAxis).attr('transform', `translate(${width}, 0)`);

      const candles = g
        .selectAll('.candle')
        .data(data)
        .enter()
        .append('g')
        .classed('candle', true);

      candles
        .append('line')
        .attr('stroke', 'black')
        .attr('x0', 0)
        .attr('x1', 0)
        .attr('y0', 50)
        .attr('y1', 50);

      candles
        .append('rect')
        .attr('width', 5)
        .attr('height', (d) => {
          const candleHeight = Math.abs(
            priceScale(getClose(d)) - priceScale(getOpen(d))
          );
          return candleHeight;
        })
        .attr('fill', (d) => (getOpen(d) > getClose(d) ? 'red' : 'green'))
        .attr('y', (d) => {
          const lowerY = priceScale(Math.min(getOpen(d), getClose(d)));
          const candleHeight = Math.abs(
            priceScale(getClose(d)) - priceScale(getOpen(d))
          );

          return lowerY - candleHeight;
        })
        .attr('x', (d) => timeScale(getOpenTime(d)) - 2.5);
    }
  }, [originalData]);

  return (
    <svg className="container" width={700} height={500} ref={containerRef} />
  );
}
