import { useMemo } from 'react';
import Plot from 'react-plotly.js';

const getCandlestickDefaults = () => ({
  x: [],
  close: [],
  high: [],
  low: [],
  open: [],
  decreasing: { line: { color: 'red' } },
  increasing: { line: { color: 'green' } },
  line: { color: 'rgba(31,119,180,1)' },
  type: 'candlestick',
  xaxis: 'x',
  yaxis: 'y',
});

const layout = {
  dragmode: 'zoom',
  margin: {
    r: 10,
    t: 25,
    b: 40,
    l: 60,
  },
  showlegend: false,
  xaxis: {
    autorange: true,
    type: 'date',
  },
  yaxis: {
    autorange: true,
    type: 'linear',
  },
};

export function CandlestickChart({ data }) {
  const plotlyData = useMemo(() => {
    const candlestickDefaults = getCandlestickDefaults();
    if (!data) {
      return candlestickDefaults;
    }
    return data.chartData.reduce(
      (result, item) => {
        result.x.push(item.openTime);
        result.close.push(item.close);
        result.high.push(item.high);
        result.low.push(item.low);
        result.open.push(item.open);
        return result;
      },
      { ...candlestickDefaults }
    );
  }, [data]);

  return (
    <div>
      <Plot
        data={[plotlyData]}
        layout={layout}
        config={{ responsive: true }}
        style={{ width: '100%', height: '100%' }}
        onHover={(event) => console.log(event)}
      />
    </div>
  );
}
