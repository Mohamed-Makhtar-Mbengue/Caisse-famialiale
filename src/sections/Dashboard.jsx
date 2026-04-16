import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalDons, setTotalDons] = useState(0);
  const [totalOut, setTotalOut] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: totalContrib, error: err1 } = await supabase.rpc("sum_contributions");
      if (err1) console.error("Erreur sum_contributions:", err1);
      setTotalContributions(totalContrib || 0);

      const { data: dons, error: err2 } = await supabase.rpc("sum_dons");
      if (err2) console.error("Erreur sum_dons:", err2);
      setTotalDons(dons || 0);

      const { data: totalOut, error: err3 } = await supabase.rpc("sum_transactions_out");
      if (err3) console.error("Erreur sum_transactions_out:", err3);
      setTotalOut(totalOut || 0);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const solde = totalContributions + totalDons - totalOut;

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
          <div className="text-3xl md:text-4xl font-bold mt-3 break-words">
            {totalContributions} GNF
          </div>
        </div>

        {/* Dons */}
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Dons</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 break-words">
            {totalDons} GNF
          </div>
        </div>

        {/* Sorties */}
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Sorties</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 break-words">
            {totalOut} GNF
          </div>
        </div>

        {/* Solde */}
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Solde</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 break-words">
            {solde} GNF
          </div>
        </div>

      </div>

    </div>
  );
}
