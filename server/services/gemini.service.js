const axios = require("axios");

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-2.0-flash",
  "gemini-pro",
];

const cleanJson = (raw) => raw.replace(/```json|```/g, "").trim();

const parseJsonSafely = (raw) => {
  const cleaned = cleanJson(raw || "");
  if (!cleaned) throw new Error("Empty AI response");

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("AI response was not valid JSON");
    }

    const candidate = cleaned.slice(start, end + 1);
    return JSON.parse(candidate);
  }
};

const callGemini = async (prompt) => {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  };

  let lastError;
  for (const model of GEMINI_MODELS) {
    try {
      const response = await axios.post(
        `${GEMINI_BASE}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        payload,
      );
      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    } catch (error) {
      lastError = error;
      if (error.response?.status !== 404) break;
    }
  }

  throw lastError || new Error("Gemini request failed");
};

const parseResume = async (resumeText) => {
  const prompt = `
		Analyze this resume and extract structured information.
		Return ONLY valid JSON, no markdown, no explanation.
		Resume: ${resumeText}
		Return this exact structure:
		{
			"name": "candidate name or null",
			"email": "email or null",
			"phone": "phone or null",
			"skills": ["skill1", "skill2"],
			"experienceYears": 3,
			"education": "degree and institution",
			"currentTitle": "current or most recent job title",
			"previousTitles": ["title1", "title2"],
			"summary": "2-sentence professional summary"
		}
	`;

  const raw = await callGemini(prompt);
  const parsed = parseJsonSafely(raw);

  return {
    name: parsed.name || null,
    email: parsed.email || null,
    phone: parsed.phone || null,
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    experienceYears: Number.isFinite(parsed.experienceYears)
      ? parsed.experienceYears
      : 0,
    education: parsed.education || "",
    summary: parsed.summary || "",
    jobTitles: [
      parsed.currentTitle,
      ...(Array.isArray(parsed.previousTitles) ? parsed.previousTitles : []),
    ].filter(Boolean),
  };
};

const scoreJobs = async (parsedResume, jobListings, preferences) => {
  const prompt = `
		You are a professional job matching AI.
		CANDIDATE PROFILE: ${JSON.stringify(parsedResume, null, 2)}
		PREFERENCES: ${JSON.stringify(preferences, null, 2)}
		JOB LISTINGS: ${JSON.stringify(jobListings.slice(0, 10), null, 2)}
		Score each job for this candidate. Return ONLY valid JSON:
		{
			"profileSummary": "2-sentence summary of candidate",
			"jobs": [
				{
					"jobId": "original job id",
					"matchScore": 85,
					"skillsMatch": 90,
					"experienceMatch": 80,
					"cultureMatch": 78,
					"strengths": ["Why they fit well 1", "Why they fit well 2"],
					"gaps": ["Missing skill 1", "Gap 2"]
				}
			]
		}
		matchScore should be 40-95. Be realistic. Use the actual job IDs from the listings.
	`;

  const raw = await callGemini(prompt);
  const parsed = parseJsonSafely(raw);

  return {
    profileSummary:
      parsed.profileSummary || "Candidate profile generated from resume.",
    jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
  };
};

module.exports = { parseResume, scoreJobs };
