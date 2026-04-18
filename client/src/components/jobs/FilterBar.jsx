export default function FilterBar({ filters, setFilters }) {
  return (
    <section className="card grid gap-4 md:grid-cols-1">
      <div>
        <label className="label">Work Type</label>
        <select
          className="input"
          value={filters.workType}
          onChange={(e) =>
            setFilters((p) => ({ ...p, workType: e.target.value }))
          }
        >
          <option value="all">All</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="on-site">On-site</option>
        </select>
      </div>
    </section>
  );
}
