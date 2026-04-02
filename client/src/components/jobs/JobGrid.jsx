import JobCard from './JobCard';

export default function JobGrid({ jobs = [] }) {
  if (!jobs.length) {
    return (
      <div className="card text-center text-gray-400">
        <p className="text-lg">No jobs match your current filters.</p>
        <p className="mt-1 text-sm">Try lowering min score or changing work type.</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <p className="text-sm text-gray-400">Showing {jobs.length} results</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => <JobCard key={job.jobId} job={job} />)}
      </div>
    </section>
  );
}
