import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../config/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex items-center justify-center px-5 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(79,70,229,0.18),transparent_40%)]" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 border border-slate-800 rounded-3xl overflow-hidden bg-slate-900/80 shadow-2xl">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 border-r border-blue-500/20">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Sparkles size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold">AI Resume Analyzer</h1>
                <p className="text-sm text-blue-200">Career intelligence platform</p>
              </div>
            </div>

            <div className="mt-20">
              <p className="text-blue-200 text-sm font-semibold tracking-[0.18em]">
                SMARTER APPLICATIONS
              </p>

              <h2 className="text-5xl font-bold leading-tight mt-5">
                Build a resume that gets noticed.
              </h2>

              <p className="text-blue-100 text-lg leading-relaxed mt-6 max-w-md">
                Analyze your resume, identify missing skills, match job
                descriptions, and improve your chances with AI-powered insights.
              </p>
            </div>
          </div>

          <p className="text-blue-200 text-sm">
            ATS analysis. Job matching. AI feedback.
          </p>
        </div>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300">
              <Sparkles size={20} />
            </div>

            <div>
              <h1 className="font-bold text-lg">AI Resume Analyzer</h1>
              <p className="text-xs text-slate-400">Career intelligence platform</p>
            </div>
          </div>

          <div>
            <p className="text-blue-400 text-sm font-semibold tracking-wider">
              WELCOME BACK
            </p>

            <h2 className="text-4xl font-bold mt-3">Sign in to your account</h2>

            <p className="text-slate-400 mt-3">
              Continue improving your resume performance.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-9 space-y-5">
            <div>
              <label className="block text-sm text-slate-300 font-medium mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white rounded-xl pl-12 pr-4 py-3.5 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white rounded-xl pl-12 pr-12 py-3.5 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-300 transition"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-3.5 font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-8">
            New here?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;