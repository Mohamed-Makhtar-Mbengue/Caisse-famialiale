import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./context/AuthContext";

import Home from "./sections/Home";
import Members from "./sections/Members";
import Contributions from "./sections/Contributions";
import Transactions from "./sections/Transactions";
import Dashboard from "./sections/Dashboard";

import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import AuthPage from "./pages/Auth";

export default function App() {
  const { role, loading, user } = useAuth();
  const [active, setActive] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return null;

  const isAdmin = role === "admin";
  const adminPages = ["contributions", "transactions"];

  if (!user && adminPages.includes(active)) {
    return <AuthPage onLogin={() => setActive("home")} />;
  }

  const renderPage = () => {
    switch (active) {
      case "members":
        return <Members />;
      case "contributions":
        return isAdmin ? <Contributions /> : <Home />;
      case "transactions":
        return isAdmin ? <Transactions /> : <Home />;
      case "dashboard":
        return <Dashboard />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex">

      {/* SIDEBAR RESPONSIVE */}
      <Sidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col">

        {/* HEADER MOBILE */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0A0F1F] sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-xl">
            ☰
          </button>
          <h1 className="text-sm font-semibold">
            {active.charAt(0).toUpperCase() + active.slice(1)}
          </h1>
          <div className="w-6" />
        </header>

        {/* HEADER DESKTOP */}
        <header className="hidden md:flex backdrop-blur bg-white/10 border-b border-slate-700 px-8 py-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {active.charAt(0).toUpperCase() + active.slice(1)}
              </h2>
              <p className="text-xs text-slate-400">
                Vue d’ensemble de la caisse familiale
              </p>
            </div>

            {isAdmin && (
              <span className="px-3 py-1 text-xs font-semibold bg-blue-700 text-white rounded-full">
                ADMIN
              </span>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setActive("home");
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
            >
              Déconnexion
            </button>
          )}
        </header>

        {/* CONTENU */}
        <main className="px-4 md:px-8 lg:px-10 py-6 flex-1">
          {renderPage()}
        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
}
