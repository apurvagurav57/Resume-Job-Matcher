import { createContext, useEffect, useContext, useMemo, useState } from "react";
import { getLatestMatches } from "../services/api";

const JobContext = createContext();

const readStoredValue = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState(() =>
    readStoredValue("jobMatches.jobs", []),
  );
  const [profileSummary, setProfileSummary] = useState(() =>
    readStoredValue("jobMatches.profileSummary", ""),
  );
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(() =>
    readStoredValue("jobMatches.filters", {
      workType: "all",
      minScore: 0,
      sortBy: "matchScore",
    }),
  );

  useEffect(() => {
    try {
      localStorage.setItem("jobMatches.jobs", JSON.stringify(jobs));
      localStorage.setItem(
        "jobMatches.profileSummary",
        JSON.stringify(profileSummary),
      );
      localStorage.setItem("jobMatches.filters", JSON.stringify(filters));
    } catch {
      // Ignore storage failures in private browsing or disabled storage.
    }
  }, [jobs, profileSummary, filters]);

  useEffect(() => {
    let cancelled = false;

    const loadLatestMatches = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        const res = await getLatestMatches();
        if (cancelled) return;

        setJobs(res.data.jobs || []);
        setProfileSummary(res.data.profileSummary || "");
      } catch {
        // Keep the cached matches if the refresh fails or no server match exists yet.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadLatestMatches();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const filtered = jobs
      .filter(
        (job) =>
          filters.workType === "all" ||
          (job.workType || "")
            .toLowerCase()
            .includes(filters.workType.toLowerCase()),
      )
      .filter((job) => (job.matchScore || 0) >= Number(filters.minScore || 0));

    if (filters.sortBy === "date") {
      return [...filtered].sort(
        (a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0),
      );
    }
    if (filters.sortBy === "salary") {
      return [...filtered].sort((a, b) =>
        (b.salary || "").localeCompare(a.salary || ""),
      );
    }
    return [...filtered].sort(
      (a, b) => (b.matchScore || 0) - (a.matchScore || 0),
    );
  }, [jobs, filters]);

  const value = useMemo(
    () => ({
      jobs,
      setJobs,
      profileSummary,
      setProfileSummary,
      loading,
      setLoading,
      filters,
      setFilters,
      filteredJobs,
    }),
    [jobs, profileSummary, loading, filters, filteredJobs],
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export const useJobs = () => useContext(JobContext);
