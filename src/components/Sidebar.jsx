import { useAuth } from "../context/AuthContext";

export default function Sidebar({ active, setActive }) {
  const menu = [
    { id: "home", label: "Accueil", icon: "🏠" },
    { id: "members", label: "Membres", icon: "👥" },
    { id: "contributions", label: "Cotisations", icon: "💶" },
    { id: "transactions", label: "Transactions", icon: "🔄" },
    { id: "dashboard", label: "Dashboard", icon: "📊" },
  ];

  return (
    <aside className="w-64 bg-[#0A0F1F] text-white flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-semibold">Caisse Familiale</h1>
        <p className="text-xs text-slate-400">Gestion familiale</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all
              ${
                active === item.id
                  ? "bg-blue-600 text-white shadow-lg scale-[1.02]"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        Famille El Mamadou Boboya Diallo
      </div>
    </aside>
  );
}
