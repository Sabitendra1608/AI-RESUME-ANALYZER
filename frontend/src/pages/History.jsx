import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/layout/MainLayout";
import { Search, Trash2, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this analysis?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/analysis/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalyses((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete analysis");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/analysis/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAnalyses(res.data.analyses || []);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredAnalyses = analyses.filter((item) =>
    item.summary?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-xl font-semibold text-white">Loading history...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-950 rounded-3xl p-8 mb-8 shadow-2xl border border-blue-900/40">
          <h1 className="text-4xl font-bold text-white">Analysis History</h1>
          <p className="mt-3 text-blue-100">
            Track your previous resume analyses and performance scores.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search analyses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-white w-full placeholder:text-slate-500"
            />
          </div>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <FileText className="mx-auto text-blue-400 mb-4" size={42} />
            <h2 className="text-2xl font-bold text-white">No analyses found</h2>
            <p className="text-slate-400 mt-2">
              Upload a resume to see your analysis history here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAnalyses.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-blue-600/60 hover:shadow-blue-950/40 transition"
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Resume Analysis
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-blue-600/20 text-blue-300 border border-blue-700/40 px-4 py-2 rounded-full font-bold">
                    ATS {item.atsScore || 0}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-400">Match Score</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">
                      {item.matchScore || 0}%
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-400">Skills Found</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">
                      {item.skills?.length || 0}
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 line-clamp-3 leading-relaxed">
                  {item.summary || "No summary available"}
                </p>

                <div className="mt-5">
                  <h3 className="font-semibold mb-3 text-white">Top Skills</h3>

                  <div className="flex flex-wrap gap-2">
                    {item.skills?.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-500/10 text-blue-300 border border-blue-700/40 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-800">
                  <button
  onClick={() => navigate(`/analysis/${item._id}`)}
  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
>
  <Eye size={17} />
  View
</button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition font-medium"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default History;