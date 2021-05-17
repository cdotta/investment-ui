import { VALID_INTERVALS } from '../constants';

export function IntervalSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {VALID_INTERVALS.map((interval) => (
        <option value={interval} key={interval}>
          {interval}
        </option>
      ))}
    </select>
  );
}
