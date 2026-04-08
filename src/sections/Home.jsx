import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [membersCount, setMembersCount] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalDons, setTotalDons] = useState(0);
  const [totalOut, setTotalOut] = useState(0);
  const [lateMembers, setLateMembers] = useState([]);

  const fetchKPIs = async () => {
    const { count: membersCount } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true });
    setMembersCount(membersCount || 0);

    const { data: totalContrib } = await supabase.rpc("sum_contributions");
    setTotalContributions(totalContrib || 0);

    const { data: dons } = await supabase.rpc("sum_dons");
    setTotalDons(dons || 0);

    const { data: totalOut } = await supabase.rpc("sum_transactions_out");
    setTotalOut(totalOut || 0);
  };

  const fetchLateMembers = async () => {
    const { data } = await supabase.rpc("late_members");
    setLateMembers(data || []);
  };

  useEffect(() => {
    fetchKPIs();
    fetchLateMembers();
  }, []);

  const solde = totalContributions + totalDons - totalOut;

  return (
    <div className="space-y-10 p-6 rounded-xl bg-[#0A0F1F] text-white">

      <h1 className="text-3xl font-semibold">Bienvenue dans la Caisse Familiale</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Membres</span>
          <div className="text-4xl font-bold mt-3">{membersCount}</div>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Cotisations encaissées</span>
          <div className="text-4xl font-bold mt-3">{totalContributions} GNF</div>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Dons</span>
          <div className="text-4xl font-bold mt-3">{totalDons} GNF</div>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Sorties</span>
          <div className="text-4xl font-bold mt-3">{totalOut} GNF</div>
        </div>

      </div>

      <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
        <span className="text-slate-400 text-sm">Solde actuel</span>
        <div className="text-4xl font-bold mt-3">{solde} GNF</div>
      </div>

      <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
        <h2 className="text-lg font-semibold mb-4">🔔 Membres en retard</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-3 px-2 text-slate-400">Nom</th>
              <th className="py-3 px-2 text-slate-400">Payé</th>
              <th className="py-3 px-2 text-slate-400">Manquant</th>
              <th className="py-3 px-2 text-slate-400">Statut</th>
            </tr>
          </thead>

          <tbody>
            {lateMembers
              .sort((a, b) => b.missing - a.missing)
              .map((m, i) => (
                <tr key={i} className="border-b border-slate-700">
                  <td className="py-3 px-2">{m.name}</td>
                  <td className="py-3 px-2">{m.total_paid} GNF</td>
                  <td className="py-3 px-2 text-red-400">{m.missing} GNF</td>
                  <td className="py-3 px-2">
                    {m.missing > 0 ? (
                      <span className="px-2 py-1 rounded bg-red-600 text-xs">En retard</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-green-600 text-xs">OK</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
