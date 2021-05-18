import { Checkbox } from '@chakra-ui/checkbox';
import { useState, useCallback } from 'react';
import { DEFAULT_INTERVAL, DEFAULT_LIMIT } from '../constants';

import { IntervalSelect } from './IntervalSelect';

export function ChartFilters({ onFilterChange, isLive, onIsLiveChange }) {
  const [interval, setChartInterval] = useState(DEFAULT_INTERVAL);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onFilterChange({ interval, limit });
    },
    [interval, limit, onFilterChange]
  );

  return (
    <div>
      <Checkbox
        isChecked={isLive}
        onChange={(event) => onIsLiveChange(event.target.checked)}
      >
        Live Data
      </Checkbox>
      <form onSubmit={handleSubmit}>
        <input
          value={limit}
          onChange={(event) => setLimit(parseInt(event.target.value, 10))}
        />
        <IntervalSelect
          value={interval}
          onChange={(value) => setChartInterval(value)}
        />
        <button type="submit">filter</button>
      </form>
    </div>
  );
}
