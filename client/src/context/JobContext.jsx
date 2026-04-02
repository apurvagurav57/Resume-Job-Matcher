import { createContext, useContext, useMemo, useState } from "react";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [profileSummary, setProfileSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    workType: "all",
    minScore: 0,
    sortBy: "matchScore",
  });

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
