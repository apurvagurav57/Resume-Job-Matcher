const axios = require("axios");

const searchJobs = async (query, location, workType = "all") => {
  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: {
      query: `${query} in ${location}`,
      page: "1",
      num_pages: "1",
      employment_types: workType === "remote" ? "FULLTIME" : "FULLTIME",
      remote_jobs_only: workType === "remote" ? "true" : "false",
    },
    headers: {
      "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);
  return (response.data?.data || []).map((job) => ({
    jobId: job.job_id,
    title: job.job_title,
    company: job.employer_name,
    location: `${job.job_city || ""}, ${job.job_country || ""}`.trim(),
    workType: job.job_is_remote ? "Remote" : "On-site",
    salary: job.job_salary_period
      ? `${job.job_min_salary || ""}-${job.job_max_salary || ""} ${job.job_salary_currency || ""}`
      : "Not specified",
    postedAt: job.job_posted_at_datetime_utc,
    applyLink: job.job_apply_link,
    description: job.job_description?.substring(0, 500),
    requiredSkills: job.job_required_skills || [],
  }));
};

module.exports = { searchJobs };
