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
    <div className="text-white space-y-10">

      <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Carte */}
        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Cotisations</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 wrap-break-word">
            {totalContributions} GNF
          </div>
        </div>

        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Dons</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 wrap-break-word">
            {totalDons} GNF
          </div>
        </div>

        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Sorties</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 wrap-break-word">
            {totalOut} GNF
          </div>
        </div>

        <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-sm">Solde</span>
          <div className="text-3xl md:text-4xl font-bold mt-3 wrap-break-word">
            {solde} GNF
          </div>
        </div>

      </div>

    </div>
  );
}
