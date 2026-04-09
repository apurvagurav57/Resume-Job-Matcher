import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/Footer";
import ResumeUpload from "../components/resume/ResumeUpload";
import ResumePreview from "../components/resume/ResumePreview";
import { useResume } from "../hooks/useResume";
import { findMatches } from "../services/api";
import { useJobs } from "../hooks/useJobs";

const initialPrefs = {
  role: "",
  location: "",
  workType: "all",
  experienceLevel: "",
  salary: "",
  industry: "",
};

export default function UploadResume() {
  const navigate = useNavigate();
  const { resume, fetchResume, loading } = useResume();
  const [preferences, setPreferences] = useState(initialPrefs);
  const { setJobs, setProfileSummary, setLoading } = useJobs();

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFindMatches = async () => {
    try {
      setLoading(true);
      const res = await findMatches(preferences);
      setJobs(res.data.jobs || []);
      setProfileSummary(res.data.profileSummary || "");
      toast.success("Matches generated");
      navigate("/matches");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to find matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <h1 className="text-2xl font-bold">Upload Resume</h1>
        {resume && <ResumePreview resume={resume} />}
        <ResumeUpload onUploaded={() => fetchResume()} />
        <section className="card space-y-4">
          <h2 className="text-lg font-semibold">Job Preferences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.keys(initialPrefs).map((key) => (
              <div key={key}>
                <label className="label">{key}</label>
                {key === "workType" ? (
                  <select
                    className="input"
                    value={preferences[key]}
                    onChange={(e) =>
                      setPreferences((p) => ({ ...p, [key]: e.target.value }))
                    }
                  >
                    <option value="all">All</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                ) : (
                  <input
                    className="input"
                    value={preferences[key]}
                    onChange={(e) =>
                      setPreferences((p) => ({ ...p, [key]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleFindMatches}
            disabled={loading}
          >
            Find My Matches
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
