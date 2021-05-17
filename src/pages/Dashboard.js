import { useQuery } from '@apollo/client';
import { CHART_DATA_QUERY } from '../graphql/queries';
import { CandlestickChart } from '../components/CandlestickChart';
import { ChartFilters } from '../components/ChartFilters';
import { useState } from 'react';

function Dashboard() {
  const [chartDataInput, setChartDataInput] = useState({
    source: 'Binance',
    symbol: 'ADAUSDT',
    interval: '1h',
    limit: 10,
  });

  const { loading, data } = useQuery(CHART_DATA_QUERY, {
    variables: {
      chartDataInput,
    },
  });

  const handleFilterChange = (filters) => {
    setChartDataInput({ ...chartDataInput, ...filters });
  };

  return (
    <div>
      <ChartFilters onFilterChange={handleFilterChange} />
      {loading && <div>Loading...</div>}
      {!loading && <CandlestickChart data={data} />}
    </div>
  );
}

export default Dashboard;
