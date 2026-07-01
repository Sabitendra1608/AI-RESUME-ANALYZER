import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;