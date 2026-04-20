const axios = require("axios");

const readRapidApiMessage = (error) => {
  const payload = error?.response?.data;
  if (typeof payload === "string" && payload.trim()) return payload.trim();

  if (payload && typeof payload === "object") {
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message.trim();
    }
    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error.trim();
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return "JSearch request failed";
};

const normalizeWorkType = (workType) => {
  const value = String(workType || "all")
    .toLowerCase()
    .trim();
  if (
    ["remote", "hybrid", "on-site", "onsite", "on site", "all"].includes(value)
  ) {
    if (value === "onsite" || value === "on site") return "on-site";
    return value;
  }
  return "all";
};

const inferWorkType = (job) => {
  if (job.job_is_remote) return "Remote";

  const searchableText = [
    job.job_employment_type,
    job.job_title,
    job.job_description,
    job.job_city,
    job.job_country,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (searchableText.includes("hybrid")) return "Hybrid";
  return "On-site";
};

const AGGREGATOR_HOST_HINTS = [
  "linkedin.com",
  "indeed.com",
  "glassdoor.com",
  "ziprecruiter.com",
  "cutshort.io",
  "foundit.",
  "shine.com",
  "wellfound.com",
  "instahyre.com",
  "monster.",
  "naukri.com",
  "timesjobs.com",
  "simplyhired.com",
  "jooble.",
  "careerjet.",
  "talent.com",
  "jobrapido.",
  "adzuna.",
  "google.com",
  "googleapis.com",
];

const TRUSTED_ATS_HINTS = [
  "greenhouse.io",
  "lever.co",
  "myworkdayjobs.com",
  "smartrecruiters.com",
  "ashbyhq.com",
  "jobvite.com",
  "icims.com",
  "bamboohr.com",
  "oraclecloud.com",
];

const normalizeDomainToken = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const parseLink = (value) => {
  if (!value || typeof value !== "string") return null;
  try {
    return new URL(value.trim());
  } catch {
    return null;
  }
};

const isAggregatorHost = (host) =>
  AGGREGATOR_HOST_HINTS.some((hint) => host.includes(hint));

const isTrustedAtsHost = (host) =>
  TRUSTED_ATS_HINTS.some((hint) => host.includes(hint));

const isLikelyCompanyHost = (host, company) => {
  const token = normalizeDomainToken(company);
  if (!token || token.length < 4) return false;
  return host.replace(/[^a-z0-9]/g, "").includes(token);
};

const isAllowedApplyHost = (host, company) => {
  if (!host) return false;
  if (isAggregatorHost(host)) return false;
  if (isTrustedAtsHost(host)) return true;
  return isLikelyCompanyHost(host, company);
};

const sanitizeApplyLink = (url, company) => {
  const parsed = parseLink(url);
  if (!parsed) return "";
  const host = parsed.hostname.toLowerCase();
  return isAllowedApplyHost(host, company) ? parsed.toString() : "";
};

const getApplyCandidates = (job) => {
  const options = Array.isArray(job?.apply_options) ? job.apply_options : [];

  const optionCandidates = options
    .map((opt) => {
      if (!opt || typeof opt !== "object") return null;
      const link =
        opt.apply_link ||
        opt.link ||
        opt.url ||
        (typeof opt.publisher === "string" && opt.publisher.startsWith("http")
          ? opt.publisher
          : "");
      if (!link) return null;

      return {
        url: link,
        source: opt.publisher || "apply_option",
        isDirect: Boolean(opt.is_direct),
      };
    })
    .filter(Boolean);

  const topLevelCandidates = [
    { url: job?.job_apply_link, source: "job_apply_link", isDirect: false },
    { url: job?.job_offer_link, source: "job_offer_link", isDirect: true },
    {
      url: job?.employer_website,
      source: "employer_website",
      isDirect: true,
    },
    { url: job?.job_google_link, source: "job_google_link", isDirect: false },
  ].filter((item) => item.url);

  return [...optionCandidates, ...topLevelCandidates];
};

const pickBestApplyLink = (job) => {
  const candidates = getApplyCandidates(job);
  if (!candidates.length) return "";

  const scored = candidates
    .map((candidate) => {
      const parsed = parseLink(candidate.url);
      if (!parsed) return null;

      const host = parsed.hostname.toLowerCase();
      const aggregator = isAggregatorHost(host);
      let score = 0;

      if (candidate.isDirect) score += 120;
      if (parsed.protocol === "https:") score += 8;
      if (isLikelyCompanyHost(host, job?.employer_name)) score += 80;
      if (isTrustedAtsHost(host)) score += 65;
      if (aggregator) score -= 120;

      return {
        url: parsed.toString(),
        score,
        aggregator,
        host,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  const preferred = scored.find((candidate) =>
    isAllowedApplyHost(candidate.host, job?.employer_name),
  );
  return preferred?.url || "";
};

const searchJobs = async (query, location, workType = "all") => {
  const normalizedWorkType = normalizeWorkType(workType);
  const role = String(query || "Software Engineer").trim();
  const where = String(location || "India").trim();
  const apiKey = String(process.env.JSEARCH_API_KEY || "").trim();

  if (!apiKey) {
    const missingKeyError = new Error(
      "JSearch API key is not configured. Set JSEARCH_API_KEY in server/.env.",
    );
    missingKeyError.statusCode = 500;
    throw missingKeyError;
  }

  // Hybrid is not a dedicated filter in JSearch, so we bias query terms and classify later.
  const workModeHint =
    normalizedWorkType === "remote"
      ? " remote"
      : normalizedWorkType === "hybrid"
        ? " hybrid"
        : "";

  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: {
      query: `${role}${workModeHint} in ${where}`,
      page: "1",
      num_pages: process.env.JSEARCH_NUM_PAGES || "3",
      remote_jobs_only: normalizedWorkType === "remote" ? "true" : "false",
    },
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const jobs = response.data?.data || [];

    return jobs
      .map((job) => {
        const workTypeLabel = inferWorkType(job);
        const city = String(job.job_city || "").trim();
        const country = String(job.job_country || "").trim();
        const combinedLocation = [city, country].filter(Boolean).join(", ");

        return {
          jobId: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: combinedLocation || where,
          workType: workTypeLabel,
          salary: job.job_salary_period
            ? `${job.job_min_salary || ""}-${job.job_max_salary || ""} ${job.job_salary_currency || ""}`.trim()
            : "Not specified",
          postedAt: job.job_posted_at_datetime_utc,
          applyLink: pickBestApplyLink(job),
          description: job.job_description?.substring(0, 500),
          requiredSkills: job.job_required_skills || [],
        };
      })
      .filter((job) => {
        if (normalizedWorkType === "all") return true;
        if (normalizedWorkType === "remote") return job.workType === "Remote";
        if (normalizedWorkType === "hybrid") return job.workType === "Hybrid";
        if (normalizedWorkType === "on-site") return job.workType === "On-site";
        return true;
      });
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const providerMessage = readRapidApiMessage(error);
      const notSubscribed = /not subscribed/i.test(providerMessage);
      const authError = new Error(
        notSubscribed
          ? "RapidAPI rejected this key for JSearch: You are not subscribed to this API for the account that owns this key. Subscribe to JSearch using the same RapidAPI account, then use that account's key in JSEARCH_API_KEY."
          : `RapidAPI JSearch authorization failed: ${providerMessage}`,
      );
      authError.statusCode = error.response.status;
      throw authError;
    }

    const wrappedError = new Error(readRapidApiMessage(error));
    wrappedError.statusCode = error.response?.status || 500;
    throw wrappedError;
  }
};

module.exports = { searchJobs, sanitizeApplyLink };
