import Navbar from '../components/common/navbar';
import Footer from '../components/common/Footer';
import FilterBar from '../components/jobs/FilterBar';
import JobGrid from '../components/jobs/JobGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useJobs } from '../hooks/useJobs';

export default function JobMatches() {
  const { profileSummary, loading, filters, setFilters, filteredJobs } = useJobs();

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <section className="card">
          <h1 className="text-2xl font-bold">AI Job Matches</h1>
          <p className="mt-2 text-gray-400">{profileSummary || 'Generate matches to see your profile summary.'}</p>
        </section>
        <FilterBar filters={filters} setFilters={setFilters} />
        {loading ? <LoadingSpinner /> : <JobGrid jobs={filteredJobs} />}
      </main>
      <Footer />
    </div>
  );
}
