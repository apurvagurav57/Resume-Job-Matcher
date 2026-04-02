import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getScoreColor } from '../../utils/formatters';

export default function MatchScore({ score = 0, size = 70 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  return (
    <div style={{ width: size }} className="text-center">
      <CircularProgressbar
        value={value}
        text={`${value}`}
        styles={buildStyles({
          pathColor: getScoreColor(value),
          textColor: '#E2E8F0',
          trailColor: '#2a2a33',
        })}
      />
      <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400">Match Score</p>
    </div>
  );
}
