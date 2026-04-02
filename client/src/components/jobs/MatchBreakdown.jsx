const Metric = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-sm text-gray-300">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-800">
      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }} />
    </div>
  </div>
);

export default function MatchBreakdown({ job = {} }) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-800 bg-surface p-4">
      <Metric label="Skills Match" value={job.skillsMatch || 0} />
      <Metric label="Experience Match" value={job.experienceMatch || 0} />
      <Metric label="Culture Match" value={job.cultureMatch || 0} />
    </div>
  );
}
