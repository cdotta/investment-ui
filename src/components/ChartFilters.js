import { useState } from 'react';
import { IntervalSelect } from './IntervalSelect';

export function ChartFilters({ onFilterChange }) {
  const [interval, setChartInterval] = useState('1h');
  const [limit, setLimit] = useState(10);

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange({ interval, limit });
  };

  return (
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
  );
}
