import { useMemo } from 'react';
import * as d3 from 'd3';

import {
  margin,
  getHigh,
  getLow,
  getOpenTime,
} from '../helpers/candlestickHelper';

export const useChartMetadata = (svg, data) =>
  useMemo(() => {
    if (!svg || !data) {
      return null;
    }
    const containerWidth = +svg.attr('width');
    const containerHeight = +svg.attr('height');
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    const maxPrice = d3.max(data, getHigh);
    const minPrice = d3.min(data, getLow);
    const priceExtension = (maxPrice - minPrice) * 0.1;
    const maxOpenTime = d3.max(data, getOpenTime);
    const minOpenTime = d3.min(data, getOpenTime);
    const timeExtension = (maxOpenTime - minOpenTime) * 0.1;

    const timeScale = d3
      .scaleTime()
      .domain([minOpenTime - timeExtension, maxOpenTime + timeExtension])
      .range([0, width]);

    const priceScale = d3
      .scaleLinear()
      .domain([minPrice - priceExtension, maxPrice + priceExtension])
      .range([height, 0]);

    return {
      containerHeight,
      containerWidth,
      width,
      height,
      maxPrice,
      minPrice,
      priceExtension,
      maxOpenTime,
      minOpenTime,
      timeExtension,
      timeScale,
      priceScale,
    };
  }, [svg, data]);
