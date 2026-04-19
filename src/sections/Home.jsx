import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StatusBadge from "../components/StatusBadge";

export default function Home() {
  const [membersCount, setMembersCount] = useState(0);
  const [solde, setSolde] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalDons, setTotalDons] = useState(0);
  const [totalOut, setTotalOut] = useState(0);
  const [lateMembers, setLateMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKPIs = async () => {
    try {
      const { count: membersCount } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });
      setMembersCount(membersCount || 0);

      const { data: soldeData } = await supabase.rpc("solde_global");
      setSolde(soldeData || 0);

      const { data: totalContrib } = await supabase.rpc("sum_contributions");
      setTotalContributions(totalContrib || 0);

      const { data: dons } = await supabase.rpc("sum_dons");
      setTotalDons(dons || 0);

      const { data: totalOut } = await supabase.rpc("sum_transactions_out");
      setTotalOut(totalOut || 0);

    } catch (err) {
      console.error("Erreur KPIs:", err);
    }
  };

  const fetchLateMembers = async () => {
    try {
      const { data } = await supabase.rpc("late_members");
      setLateMembers(data || []);
    } catch (err) {
      console.error("Erreur late_members:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchKPIs();
      await fetchLateMembers();
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-10">
        <div className="text-lg">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6 rounded-xl bg-[#0A0F1F] text-white">

      <h1 className="text-3xl font-semibold">Bienvenue dans la Caisse Familiale</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Membres</span>
          <div className="text-4xl font-bold mt-3">{membersCount}</div>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Cotisations encaissées</span>
          <div className="text-4xl font-bold mt-3">
            {totalContributions.toLocaleString()} GNF
          </div>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Dons</span>
          <div className="text-4xl font-bold mt-3">
            {totalDons.toLocaleString()} GNF
          </div>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Sorties</span>
          <div className="text-4xl font-bold mt-3">
            {totalOut.toLocaleString()} GNF
          </div>
        </div>

      </div>

      {/* Solde */}
      <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
        <span className="text-slate-400 text-sm">Solde actuel</span>
        <div className="text-4xl font-bold mt-3">
          {solde.toLocaleString()} GNF
        </div>
      </div>

      {/* Membres */}
      <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
        <h2 className="text-lg font-semibold mb-4">🔔 Suivi des cotisations</h2>

        {lateMembers.length === 0 ? (
          <div className="text-slate-400">Aucun membre en retard 🎉</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-sm">
                <th className="py-3 px-2 font-medium">Nom</th>
                <th className="py-3 px-2 font-medium">Payé</th>
                <th className="py-3 px-2 font-medium">Manquant</th>
                <th className="py-3 px-2 font-medium">Statut</th>
              </tr>
            </thead>

            <tbody>
              {lateMembers
                .sort((a, b) => b.missing - a.missing)
                .map((m, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-800 hover:bg-[#1A2234] transition"
                  >
                    <td className="py-4 px-2 font-medium">{m.name}</td>

                    <td className="py-4 px-2 text-slate-300">
                      {m.total_paid.toLocaleString()} GNF
                    </td>

                    <td
                      className={`py-4 px-2 font-semibold ${
                        m.missing > 0 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {m.missing.toLocaleString()} GNF
                    </td>

                    <td className="py-4 px-2">
                      <StatusBadge
                        missing={m.missing}
                        isLate={m.is_late}
                        statusMessage={m.status_message}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
