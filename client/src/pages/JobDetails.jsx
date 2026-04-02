import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/Footer";
import MatchScore from "../components/jobs/MatchScore";
import MatchBreakdown from "../components/jobs/MatchBreakdown";
import { createApplication } from "../services/api";
import { useJobs } from "../hooks/useJobs";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { jobs } = useJobs();
  const job = state?.job || jobs.find((j) => j.jobId === id);

  if (!job)
    return (
      <div className="min-h-screen bg-bg p-8 text-white">
        Job not found. Go back to matches.
      </div>
    );

  const handleAddToTracker = async () => {
    try {
      await createApplication({
        jobId: job.jobId,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        applyLink: job.applyLink,
        status: "saved",
        salary: job.salary,
      });
      toast.success("Added to tracker");
      navigate("/tracker");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add to tracker");
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <section className="card flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="mt-1 text-gray-400">
              {job.company} • {job.location}
            </p>
          </div>
          <MatchScore score={job.matchScore || 0} size={130} />
        </section>
        <MatchBreakdown job={job} />
        <section className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold">Strengths</h2>
            <ul className="mt-3 space-y-2">
              {(job.strengths || []).map((s, i) => (
                <li
                  key={`${s}-${i}`}
                  className="flex items-start gap-2 text-green-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4" /> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold">Gaps</h2>
            <ul className="mt-3 space-y-2">
              {(job.gaps || []).map((g, i) => (
                <li
                  key={`${g}-${i}`}
                  className="flex items-start gap-2 text-yellow-300"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4" /> {g}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="card">
          <h2 className="text-lg font-semibold">Job Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-gray-300">
            {job.description || "No description available."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={job.applyLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Apply Now
            </a>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleAddToTracker}
            >
              Add to Tracker
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
