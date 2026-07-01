import { GoogleGenAI } from "@google/genai";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getGeminiAnalysis(resumeText) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are an expert ATS resume reviewer.

Analyze the resume text below and return ONLY valid JSON.
Do not use markdown.
Do not use backticks.

Return exactly this structure:

{
  "summary": "short professional summary",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Resume text:
${resumeText}
`;

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      const status = error?.status || error?.code;
      const isLastAttempt = attempt === maxAttempts;

      console.error(
        `GEMINI ATTEMPT ${attempt} FAILED:`,
        error?.message || error
      );

      if (isLastAttempt) {
        break;
      }

      if (status === 503 || status === 429) {
        await sleep(attempt * 2000);
        continue;
      }

      break;
    }
  }

  return JSON.stringify({
    summary:
      "AI feedback is temporarily unavailable. Your ATS and job-match scores are still available.",
    strengths: [],
    weaknesses: [],
    suggestions: [
      "Try analyzing the resume again after a few moments.",
      "Check your resume for clear skills, projects, and measurable achievements.",
    ],
  });
}
