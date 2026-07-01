import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/layout/MainLayout";

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const userRes = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dashboardRes = await axios.get(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(userRes.data.user);
      setStats(dashboardRes.data);
    };

    fetchProfile();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-950 rounded-3xl p-8 mb-8 shadow-2xl border border-blue-900/40">
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <p className="mt-3 text-blue-100">
            Manage your account and view your resume analysis stats.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Account Details
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm">Name</p>
              <p className="text-white text-lg font-semibold">
                {user?.name || "Loading..."}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-white text-lg font-semibold">
                {user?.email || "Loading..."}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Joined On</p>
              <p className="text-white text-lg font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <p className="text-slate-400">Total Analyses</p>
            <h2 className="text-4xl font-bold text-white mt-2">
              {stats?.totalAnalyses || 0}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <p className="text-slate-400">Highest ATS Score</p>
            <h2 className="text-4xl font-bold text-blue-400 mt-2">
              {stats?.highestATS || 0}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <p className="text-slate-400">Average Match Score</p>
            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {stats?.averageMatchScore || 0}%
            </h2>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;