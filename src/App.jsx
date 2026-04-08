import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./context/AuthContext";

import Home from "./sections/Home";
import Members from "./sections/Members";
import Contributions from "./sections/Contributions";
import Transactions from "./sections/Transactions";
import Dashboard from "./sections/Dashboard";

import Sidebar from "./components/Sidebar";
import AuthPage from "./pages/Auth";

export default function App() {
  const { role, loading, user } = useAuth();
  const [active, setActive] = useState("home");

  if (loading) return null;

  const isAdmin = role === "admin";

  // 🔥 Si admin non connecté → page Auth
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
    <div className="flex min-h-screen bg-[#0A0F1F] text-white">

      <Sidebar active={active} setActive={setActive} />

      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="backdrop-blur bg-white/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {active.charAt(0).toUpperCase() + active.slice(1)}
              </h2>
              <p className="text-xs text-slate-400">
                Vue d’ensemble de la caisse familiale
              </p>
            </div>

            {/* BADGE ADMIN */}
            {isAdmin && (
              <span className="px-3 py-1 text-xs font-semibold bg-blue-700 text-white rounded-full">
                ADMIN
              </span>
            )}
          </div>

          {/* BOUTON DECONNEXION */}
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

        <section className="p-8 flex-1">
          {renderPage()}
        </section>

      </main>
    </div>
  );
}
