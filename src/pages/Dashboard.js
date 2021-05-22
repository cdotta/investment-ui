import { useQuery } from '@apollo/client';
import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/layout';

import { CHART_DATA_QUERY } from '../graphql/queries';
import { CandlestickChart } from '../components/CandlestickChart';
import { ChartFilters } from '../components/ChartFilters';
import { DEFAULT_INTERVAL, DEFAULT_LIMIT } from '../constants';

function Dashboard() {
  const [isLive, setIsLive] = useState(false);
  const [chartDataInput, setChartDataInput] = useState({
    source: 'Binance',
    symbol: 'ADAUSDT',
    interval: DEFAULT_INTERVAL,
    limit: DEFAULT_LIMIT,
  });

  const { loading, data } = useQuery(CHART_DATA_QUERY, {
    variables: {
      chartDataInput,
    },
    pollInterval: isLive ? 1 * 1000 : null,
  });

  const handleFilterChange = useCallback(
    (filters) => {
      setChartDataInput({ ...chartDataInput, ...filters });
    },
    [chartDataInput]
  );

  const handleIsLiveChange = useCallback(
    (value) => {
      setIsLive(value);
    },
    [setIsLive]
  );

  return (
    <Box p={2}>
      <ChartFilters
        isLive={isLive}
        onFilterChange={handleFilterChange}
        onIsLiveChange={handleIsLiveChange}
      />
      {loading && <div>Loading...</div>}
      {!loading && <CandlestickChart data={data} />}
    </Box>
  );
}

export default Dashboard;
