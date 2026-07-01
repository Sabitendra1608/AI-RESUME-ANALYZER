import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { API_URL } from "../config/api";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    const token = localStorage.getItem("token");
    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/analysis", {
        state: {
          atsScore: res.data.atsScore,
          skills: res.data.skills,
          missingSkills: res.data.missingSkills,
          sections: res.data.sections,
          suggestions: res.data.suggestions,
          resumeText: res.data.text,
          projectCount: res.data.projectCount,
          experienceCount: res.data.experienceCount,
          strengths: res.data.strengths,
          weaknesses: res.data.weaknesses,
          summary: res.data.summary,
          breakdown: res.data.breakdown,
          matchScore: res.data.matchScore,
          matchedSkills: res.data.matchedSkills,
          jdMissingSkills: res.data.jdMissingSkills,
        },
      });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      console.error("SERVER RESPONSE:", error.response?.data);

      alert(error.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-950 rounded-3xl p-8 mb-8 shadow-2xl border border-blue-900/40">
          <h1 className="text-4xl font-bold text-white">Upload Resume</h1>

          <p className="text-blue-100 mt-3">
            Upload your resume and paste a job description to get ATS insights,
            AI feedback, and job match score.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
          <div className="border-2 border-dashed border-blue-900/60 rounded-2xl p-8 text-center bg-slate-950">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4 text-slate-300"
            />

            {file && (
              <p className="text-sm text-green-400 mb-4">
                Selected: {file.name}
              </p>
            )}

            <textarea
              placeholder="Paste Job Description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-4 border border-slate-700 bg-slate-900 text-white rounded-xl mt-4 h-44 outline-none focus:border-blue-500"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-950/40"
            >
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default UploadResume;
