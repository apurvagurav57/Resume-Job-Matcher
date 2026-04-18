import Navbar from "../components/common/navbar";
import Footer from "../components/common/Footer";
import FilterBar from "../components/jobs/FilterBar";
import JobGrid from "../components/jobs/JobGrid";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useJobs } from "../hooks/useJobs";

export default function JobMatches() {
  const { profileSummary, loading, filters, setFilters, filteredJobs } =
    useJobs();

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <FilterBar filters={filters} setFilters={setFilters} />
        {loading ? <LoadingSpinner /> : <JobGrid jobs={filteredJobs} />}
      </main>
      <Footer />
    </div>
  );
}
