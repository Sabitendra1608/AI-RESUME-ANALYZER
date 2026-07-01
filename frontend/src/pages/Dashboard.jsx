import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { API_URL } from "../config/api";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        

        const res = await axios.get(`${API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(res.data);
      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-xl font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl p-8 shadow-2xl mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-blue-100 mt-3">
            Track your resume performance and AI-powered insights.
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("/upload")}
              className="bg-white text-blue-800 px-5 py-3 rounded-xl font-semibold"
            >
              Upload New Resume
            </button>

            <button
              onClick={() => navigate("/history")}
              className="border border-blue-300 text-white px-5 py-3 rounded-xl font-semibold"
            >
              View History
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Total Analyses</p>
            <h2 className="text-4xl font-bold mt-2">
              {dashboard?.totalAnalyses || 0}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Highest ATS Score</p>
            <h2 className="text-4xl font-bold mt-2 text-blue-400">
              {dashboard?.highestATS || 0}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Average Match Score</p>
            <h2 className="text-4xl font-bold mt-2 text-green-400">
              {dashboard?.averageMatchScore || 0}%
            </h2>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-5">Recent Analyses</h2>

          {dashboard?.recentAnalyses?.length === 0 ? (
            <p className="text-slate-400">No analyses yet.</p>
          ) : (
            <div className="space-y-4">
              {dashboard?.recentAnalyses?.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">Resume Analysis</p>
                    <p className="text-sm text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full">
                      ATS {item.atsScore || 0}
                    </span>

                    <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full">
                      Match {item.matchScore || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;