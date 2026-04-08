import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalDons, setTotalDons] = useState(0);
  const [totalOut, setTotalOut] = useState(0);

  const fetchData = async () => {
    const { data: totalContrib } = await supabase.rpc("sum_contributions");
    setTotalContributions(totalContrib || 0);

    const { data: dons } = await supabase.rpc("sum_dons");
    setTotalDons(dons || 0);

    const { data: totalOut } = await supabase.rpc("sum_transactions_out");
    setTotalOut(totalOut || 0);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const solde = totalContributions + totalDons - totalOut;

  return (
    <div className="p-6 text-white space-y-10">

      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Cotisations</span>
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

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Solde</span>
          <div className="text-4xl font-bold mt-3">{solde} GNF</div>
        </div>

      </div>

    </div>
  );
}
