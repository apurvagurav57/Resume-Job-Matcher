import { Briefcase, FileText, UploadCloud, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../hooks/useAuth";
import { useJobs } from "../hooks/useJobs";
import { getApplications, getMyResume } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const { jobs } = useJobs();
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getMyResume()
      .then((res) => setResume(res.data.resume))
      .catch(() => setResume(null));
    getApplications()
      .then((res) => setApplications(res.data.applications || []))
      .catch(() => setApplications([]));
  }, []);

  const stats = useMemo(() => {
    const interviews = applications.filter(
      (a) => a.status === "interview",
    ).length;
    return {
      totalMatches: jobs.length,
      totalApplications: applications.length,
      interviews,
    };
  }, [applications, jobs.length]);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <section className="card">
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name || "User"}
          </h1>
          <p className="mt-1 text-gray-400">
            Manage your resume matching journey from one place.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          <div className="card">
            <p className="text-sm text-gray-400">Total Matches</p>
            <p className="text-3xl font-bold">{stats.totalMatches}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400">Applications</p>
            <p className="text-3xl font-bold">{stats.totalApplications}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400">Interviews</p>
            <p className="text-3xl font-bold">{stats.interviews}</p>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold">Resume Status</h2>
            <p className="mt-2 text-gray-400">
              {resume
                ? "Resume uploaded and ready for matching."
                : "No active resume yet."}
            </p>
            <Link
              to="/upload"
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <UploadCloud className="h-4 w-4" /> Upload Resume
            </Link>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 grid gap-2">
              <Link
                to="/matches"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Briefcase className="h-4 w-4" /> Find Jobs
              </Link>
              <Link
                to="/tracker"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Workflow className="h-4 w-4" /> View Tracker
              </Link>
              <Link
                to="/profile"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" /> Profile
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
