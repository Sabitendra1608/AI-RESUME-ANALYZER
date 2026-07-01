import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { generatePDF } from "../utils/generatePDF";
import { API_URL } from "../config/api";

const defaultData = {
  atsScore: 0,
  skills: [],
  missingSkills: [],
  suggestions: [],
  sections: {
    education: false,
    projects: false,
    experience: false,
    certifications: false,
  },
  projectCount: 0,
  experienceCount: 0,
  resumeText: "",
  strengths: [],
  weaknesses: [],
  summary: "",
  breakdown: {
    skillScore: 0,
    projectScore: 0,
    educationScore: 0,
    experienceScore: 0,
    certificationScore: 0,
  },
  matchScore: 0,
  matchedSkills: [],
  jdMissingSkills: [],
};

function formatAnalysisData(source) {
  return {
    ...defaultData,
    ...source,
    skills: source?.skills || [],
    missingSkills: source?.missingSkills || [],
    suggestions: source?.suggestions || [],
    strengths: source?.strengths || [],
    weaknesses: source?.weaknesses || [],
    matchedSkills: source?.matchedSkills || [],
    jdMissingSkills: source?.jdMissingSkills || [],
    resumeText: source?.resumeText || source?.text || "",
    sections: {
      ...defaultData.sections,
      ...(source?.sections || {}),
    },
    breakdown: {
      ...defaultData.breakdown,
      ...(source?.breakdown || {}),
    },
  };
}

function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(() =>
    formatAnalysisData(location.state)
  );

  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_URL}/analysis/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(formatAnalysisData(res.data.analysis));
      } catch (err) {
        console.error("FETCH ANALYSIS ERROR:", err);

        setError(
          err.response?.data?.message || "Failed to load this analysis"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const breakdownItems = [
    {
      label: "Skills",
      value: data.breakdown.skillScore,
      max: 30,
    },
    {
      label: "Projects",
      value: data.breakdown.projectScore,
      max: 20,
    },
    {
      label: "Education",
      value: data.breakdown.educationScore,
      max: 15,
    },
    {
      label: "Experience",
      value: data.breakdown.experienceScore,
      max: 20,
    },
    {
      label: "Certifications",
      value: data.breakdown.certificationScore,
      max: 15,
    },
  ];

  const sectionItems = [
    {
      label: "Education",
      found: data.sections.education,
    },
    {
      label: "Projects",
      found: data.sections.projects,
    },
    {
      label: "Experience",
      found: data.sections.experience,
    },
    {
      label: "Certifications",
      found: data.sections.certifications,
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-xl font-semibold text-white">
            Loading analysis...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto min-h-[65vh] flex items-center justify-center">
          <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-10 text-center w-full">
            <h1 className="text-2xl font-bold text-white mb-3">
              Analysis Not Available
            </h1>

            <p className="text-slate-400 mb-6">{error}</p>

            <button
              onClick={() => navigate("/history")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Back to History
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-950 rounded-3xl p-8 mb-8 border border-blue-700/30 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-2">
                AI RESUME REPORT
              </p>

              <h1 className="text-4xl font-bold text-white">
                Resume Analysis Dashboard
              </h1>

              <p className="mt-3 text-blue-100">
                Detailed ATS evaluation, job matching, and AI-powered feedback.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/history")}
                className="px-5 py-3 rounded-xl border border-blue-300/40 text-white hover:bg-white/10 font-semibold transition"
              >
                Back to History
              </button>

              <button
                onClick={() => generatePDF(data)}
                className="bg-white text-blue-800 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold transition shadow-lg"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-7">
              <div className="w-32 h-32 rounded-full bg-blue-600/15 border-8 border-blue-600/40 flex flex-col items-center justify-center shrink-0">
                <p className="text-4xl font-bold text-blue-300">
                  {data.atsScore || 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">ATS SCORE</p>
              </div>

              <div className="flex-1">
                <p className="text-slate-400 text-sm">
                  Overall Resume Strength
                </p>

                <h2 className="text-3xl font-bold text-white mt-2">
                  {data.atsScore >= 80
                    ? "Strong Resume"
                    : data.atsScore >= 60
                    ? "Good Foundation"
                    : "Needs Improvement"}
                </h2>

                <p className="text-slate-400 mt-3 leading-relaxed">
                  Your ATS score is based on skills, projects, education,
                  experience, and certification signals detected in the resume.
                </p>

                <div className="w-full bg-slate-950 rounded-full h-3 mt-5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        Math.max(data.atsScore || 0, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <p className="text-slate-400 text-sm">Skills Found</p>

            <p className="text-5xl font-bold text-blue-400 mt-3">
              {data.skills.length}
            </p>

            <p className="text-slate-400 mt-3">
              Technical and core skills detected from your resume.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-sm">Job Compatibility</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Job Match Score
                </h2>
              </div>

              <p className="text-4xl font-bold text-green-400">
                {data.matchScore || 0}%
              </p>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-400 h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(data.matchScore || 0, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="text-slate-400 mt-5 leading-relaxed">
              This score compares skills found in your resume against the
              supplied job description.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <p className="text-slate-400 text-sm">Projects</p>
              <p className="text-4xl font-bold text-blue-400 mt-3">
                {data.projectCount || 0}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Detected project signals
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <p className="text-slate-400 text-sm">Experience</p>
              <p className="text-4xl font-bold text-violet-400 mt-3">
                {data.experienceCount || 0}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Experience keywords found
              </p>
            </div>

            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <p className="text-slate-400 text-sm">Missing Core Skills</p>
              <p className="text-4xl font-bold text-red-400 mt-3">
                {data.missingSkills.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            ATS Score Breakdown
          </h2>

          <div className="space-y-5">
            {breakdownItems.map((item) => {
              const percentage = Math.min(
                (Number(item.value || 0) / item.max) * 100,
                100
              );

              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-blue-300 font-semibold">
                      {item.value || 0}/{item.max}
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">
              Matched Job Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {data.matchedSkills.length > 0 ? (
                data.matchedSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-green-500/10 border border-green-500/30 text-green-300 px-3 py-2 rounded-xl text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">
                  No matched job-description skills found.
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">
              Missing Job Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {data.jdMissingSkills.length > 0 ? (
                data.jdMissingSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2 rounded-xl text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">
                  No missing job-description skills detected.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Resume Sections
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectionItems.map((item) => (
              <div
                key={item.label}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5"
              >
                <p className="text-slate-300 font-semibold">{item.label}</p>

                <p
                  className={`text-sm mt-3 font-medium ${
                    item.found ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.found ? "Found" : "Missing"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">
              AI Resume Summary
            </h2>

            <p className="text-slate-300 leading-relaxed">
              {data.summary || "No AI summary available for this analysis."}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">
              AI Suggestions
            </h2>

            <ul className="space-y-3">
              {data.suggestions.length > 0 ? (
                data.suggestions.map((suggestion, index) => (
                  <li
                    key={`${suggestion}-${index}`}
                    className="text-slate-300 flex gap-3 leading-relaxed"
                  >
                    <span className="text-blue-400 font-bold">-</span>
                    <span>{suggestion}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">
                  No suggestions available.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">
              Strengths
            </h2>

            <ul className="space-y-3">
              {data.strengths.length > 0 ? (
                data.strengths.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="text-slate-300 flex gap-3 leading-relaxed"
                  >
                    <span className="text-green-400">+</span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">
                  No strengths available.
                </li>
              )}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">
              Weaknesses
            </h2>

            <ul className="space-y-3">
              {data.weaknesses.length > 0 ? (
                data.weaknesses.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="text-slate-300 flex gap-3 leading-relaxed"
                  >
                    <span className="text-red-400">-</span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">
                  No weaknesses available.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 pb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">
              Skills Detected
            </h2>

            <div className="flex flex-wrap gap-2">
              {data.skills.length > 0 ? (
                data.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-blue-500/10 text-blue-300 border border-blue-700/40 px-3 py-2 rounded-xl text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">No skills detected.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {data.missingSkills.length > 0 ? (
                data.missingSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-red-500/10 text-red-300 border border-red-500/30 px-3 py-2 rounded-xl text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">
                  No missing skills detected.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Analysis;
