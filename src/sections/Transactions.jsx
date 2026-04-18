import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Transactions() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState("Entrée");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [date, setDate] = useState("");

  // Admin login states
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Connexion admin
  const loginAdmin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
      options: { data: { role: "admin" } }
    });

    if (error) {
      alert("Identifiants incorrects");
      return;
    }

    // 🔥 Recharge la session pour mettre à jour le rôle dans AuthContext
    const { data: refreshed } = await supabase.auth.getSession();
    console.log("JWT:", refreshed.session?.user?.user_metadata);

    alert("Connexion admin réussie");
  };

  // Charger les mois
  const fetchMonths = async () => {
    const { data } = await supabase.rpc("list_transaction_months");
    setMonths(data || []);
  };

  // Charger les transactions d’un mois
  const loadMonthTransactions = async (monthKey) => {
    const { data } = await supabase.rpc("transactions_by_month", { m: monthKey });
    setTransactions(data || []);
  };

  // Calcul du solde actuel
  const getSoldeActuel = async () => {
    const { data: totalContrib } = await supabase.rpc("sum_contributions");
    const { data: dons } = await supabase.rpc("sum_dons");
    const { data: totalOut } = await supabase.rpc("sum_transactions_out");

    return (totalContrib || 0) + (dons || 0) - (totalOut || 0);
  };

  const resetForm = () => {
    setEditingId(null);
    setType("Entrée");
    setAmount("");
    setReason("");
    setCustomReason("");
    setDate("");
  };

  const addOrUpdateTransaction = async () => {
    if (!isAdmin) {
      alert("Vous devez être admin pour effectuer cette action.");
      return;
    }

    if (!amount || !date) return;

    const finalReason = reason === "Autre" ? customReason : reason;

    // empêcher solde négatif
    if (type === "Sortie") {
      const solde = await getSoldeActuel();
      if (Number(amount) > solde) {
        alert("Impossible : le solde ne peut pas devenir négatif.");
        return;
      }
    }

    if (editingId) {
      await supabase
        .from("transactions")
        .update({
          type,
          amount: Number(amount),
          reason: finalReason,
          date,
        })
        .eq("id", editingId);
    } else {
      await supabase.from("transactions").insert([
        {
          type,
          amount: Number(amount),
          reason: finalReason,
          date,
        },
      ]);
    }

    fetchMonths();
    if (selectedMonth) loadMonthTransactions(selectedMonth);
    resetForm();
  };

  const deleteTransaction = async (id) => {
    if (!isAdmin) {
      alert("Vous devez être admin pour supprimer.");
      return;
    }

    await supabase.from("transactions").delete().eq("id", id);
    fetchMonths();
    if (selectedMonth) loadMonthTransactions(selectedMonth);
  };

  const startEdit = (t) => {
    if (!isAdmin) {
      alert("Vous devez être admin pour modifier.");
      return;
    }

    setEditingId(t.id);
    setType(t.type);
    setAmount(t.amount);
    setReason(t.reason);
    setCustomReason("");
    setDate(t.date);
  };

  useEffect(() => {
    fetchMonths();
  }, []);

  return (
    <div className="space-y-10 text-white">

      <h1 className="text-2xl md:text-3xl font-semibold">Transactions</h1>

      {/* 🔒 Connexion Admin */}
      {!isAdmin && (
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6">
          <h2 className="text-lg font-semibold mb-3">Connexion Admin</h2>

          <input
            type="email"
            placeholder="Email admin"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="input input-bordered bg-slate-800 border-slate-600 text-white w-full mb-3"
          />

          <input
            type="password"
            placeholder="Mot de passe admin"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="input input-bordered bg-slate-800 border-slate-600 text-white w-full mb-3"
          />

          <button
            onClick={loginAdmin}
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition shadow"
          >
            Se connecter
          </button>
        </div>
      )}

      {/* Formulaire */}
      {isAdmin && (
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">

          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Modifier la transaction" : "Ajouter une transaction"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="select select-bordered bg-slate-800 border-slate-600 text-white w-full"
            >
              <option value="Entrée">Entrée</option>
              <option value="Sortie">Sortie</option>
            </select>

            <input
              type="number"
              placeholder="Montant"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input input-bordered bg-slate-800 border-slate-600 text-white w-full"
            />

            <div>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="select select-bordered bg-slate-800 border-slate-600 text-white w-full"
              >
                <option value="">Choisir un motif</option>
                <option value="Don">Don</option>
                <option value="Emprunt">Emprunt</option>
                <option value="Cotisation">Cotisation</option>
                <option value="Autre">Autre…</option>
              </select>

              {reason === "Autre" && (
                <input
                  type="text"
                  placeholder="Motif personnalisé"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="input input-bordered bg-slate-800 border-slate-600 text-white w-full mt-2"
                />
              )}
            </div>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered bg-slate-800 border-slate-600 text-white w-full"
            />

          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={addOrUpdateTransaction}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow"
            >
              {editingId ? "Mettre à jour" : "Ajouter"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition shadow"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* LISTE REGROUPÉE PAR MOIS */}
      <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">

        <h2 className="text-lg font-semibold mb-4">Historique par mois</h2>

        {months.map((m) => (
          <div key={m.month_key} className="mb-4">

            <button
              onClick={() => {
                setSelectedMonth(m.month_key);
                loadMonthTransactions(m.month_key);
              }}
              className="w-full text-left px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition"
            >
              <span className="font-semibold">
                {new Date(m.month_key + "-01").toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="text-slate-400 ml-2">({m.total} transactions)</span>
            </button>

            {selectedMonth === m.month_key && (
              <div className="mt-3 ml-2 md:ml-4 bg-slate-900 p-4 rounded-lg border border-slate-700">

                <ul className="space-y-3">
                  {transactions.map((t) => (
                    <li
                      key={t.id}
                      className="flex flex-col md:flex-row md:justify-between md:items-center text-slate-300 bg-slate-800 p-3 rounded-lg border border-slate-700"
                    >

                      <div className="text-sm">
                        <span className="font-semibold">{t.type}</span> — {t.amount} GNF  
                        <span className="text-blue-400 ml-2">({t.reason})</span>
                      </div>

                      {isAdmin && (
                        <div className="flex gap-2 mt-2 md:mt-0">
                          <button
                            onClick={() => startEdit(t)}
                            className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={() => deleteTransaction(t.id)}
                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}

                    </li>
                  ))}
                </ul>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}
