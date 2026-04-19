import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalDons, setTotalDons] = useState(0);
  const [totalOut, setTotalOut] = useState(0);
  const [solde, setSolde] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: totalContrib } = await supabase.rpc("sum_contributions");
      setTotalContributions(totalContrib || 0);

      const { data: dons } = await supabase.rpc("sum_dons");
      setTotalDons(dons || 0);

      const { data: totalOut } = await supabase.rpc("sum_transactions_out");
      setTotalOut(totalOut || 0);

      const { data: soldeData } = await supabase.rpc("solde_global");
      setSolde(soldeData || 0);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-10">
        <div className="text-lg">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div className="text-white space-y-10">

      <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Cotisations */}
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Cotisations</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 wrap-break-word">
            {totalContributions.toLocaleString()} GNF
          </div>
        </div>

        {/* Dons */}
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Dons</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 wrap-break-word">
            {totalDons.toLocaleString()} GNF
          </div>
        </div>

        {/* Sorties */}
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Sorties</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 wrap-break-word">
            {totalOut.toLocaleString()} GNF
          </div>
        </div>

        {/* Solde */}
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Solde</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 wrap-break-word">
            {solde.toLocaleString()} GNF
          </div>
        </div>

      </div>

    </div>
  );
}
