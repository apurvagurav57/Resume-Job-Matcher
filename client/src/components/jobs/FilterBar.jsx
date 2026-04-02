export default function FilterBar({ filters, setFilters }) {
  const reset = () => setFilters({ workType: 'all', minScore: 0, sortBy: 'matchScore' });

  return (
    <section className="card grid gap-4 md:grid-cols-4">
      <div>
        <label className="label">Work Type</label>
        <select className="input" value={filters.workType} onChange={(e) => setFilters((p) => ({ ...p, workType: e.target.value }))}>
          <option value="all">All</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="on-site">On-site</option>
        </select>
      </div>

      <div>
        <label className="label">Min Match Score: {filters.minScore}</label>
        <input
          className="w-full"
          type="range"
          min="0"
          max="100"
          value={filters.minScore}
          onChange={(e) => setFilters((p) => ({ ...p, minScore: Number(e.target.value) }))}
        />
      </div>

      <div>
        <label className="label">Sort by</label>
        <select className="input" value={filters.sortBy} onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}>
          <option value="matchScore">Match Score</option>
          <option value="date">Date Posted</option>
          <option value="salary">Salary</option>
        </select>
      </div>

      <div className="flex items-end">
        <button type="button" className="btn-secondary w-full" onClick={reset}>Reset Filters</button>
      </div>
    </section>
  );
}
