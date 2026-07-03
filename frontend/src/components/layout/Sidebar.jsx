import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-5 py-3 rounded-xl font-medium transition ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 p-6 text-white">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-400">
          AI Resume Analyzer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
           Dashboard
        </p>
      </div>

      <nav className="space-y-3">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/upload" className={linkClass}>
          Upload Resume
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          Analysis History
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-10 w-full px-5 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition font-medium"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;