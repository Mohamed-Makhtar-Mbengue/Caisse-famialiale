import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Contributions() {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [months, setMonths] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [member, setMember] = useState("");
  const [amount, setAmount] = useState("");
  const [event, setEvent] = useState("");
  const [month, setMonth] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  const fetchData = async () => {
    const { data: membersData } = await supabase.from("members").select("*");
    setMembers(membersData || []);

    const { data: eventsData } = await supabase.from("events").select("*");
    setEvents(eventsData || []);

    const { data: monthsData } = await supabase.rpc("list_contribution_months");
    setMonths(monthsData || []);
  };

  const loadMonthDetails = async (monthKey) => {
    const { data } = await supabase.rpc("contributions_by_month", { m: monthKey });
    setDetails(data || []);
  };

  const resetForm = () => {
    setMember("");
    setAmount("");
    setEvent("");
    setMonth("");
    setEditingId(null);
  };

  const addOrUpdateContribution = async () => {
    if (!member || !amount || !month) return;

    const [year, monthNumber] = month.split("-");
    const date = `${year}-${monthNumber}-01`;

    if (editingId) {
      await supabase
        .from("contributions")
        .update({
          member_id: member,
          amount: Number(amount),
          event_id: event || null,
          date: date,
          month_key: month,
        })
        .eq("id", editingId);

      await supabase
        .from("transactions")
        .update({
          amount: Number(amount),
          date: date,
        })
        .eq("contribution_id", editingId);
    } else {
      const { data: contrib } = await supabase
        .from("contributions")
        .insert([
          {
            member_id: member,
            amount: Number(amount),
            event_id: event || null,
            date: date,
            month_key: month,
          },
        ])
        .select()
        .single();

      await supabase.from("transactions").insert([
        {
          type: "Entrée",
          amount: Number(amount),
          reason: "Cotisation",
          date: date,
          contribution_id: contrib.id,
        },
      ]);
    }

    fetchData();
    if (selectedMonth) loadMonthDetails(selectedMonth);
    resetForm();
  };

  const deleteContribution = async (id) => {
    await supabase.from("contributions").delete().eq("id", id);
    fetchData();
    if (selectedMonth) loadMonthDetails(selectedMonth);
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setMember(c.member_id);
    setAmount(c.amount);
    setEvent(c.event_id || "");
    setMonth(c.month_key);
  };

  const createEvent = async () => {
    if (!eventName) return;

    await supabase.from("events").insert([
      {
        name: eventName,
        description: eventDesc || null,
      },
    ]);

    setEventName("");
    setEventDesc("");
    setShowEventModal(false);

    const { data: eventsData } = await supabase.from("events").select("*");
    setEvents(eventsData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-10 text-white">
      <h1 className="text-3xl font-semibold">Cotisations & Événements</h1>

      <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Modifier la cotisation" : "Ajouter une cotisation"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={member}
            onChange={(e) => setMember(e.target.value)}
            className="select select-bordered bg-slate-800 border-slate-600 text-white"
          >
            <option value="">Choisir un membre</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered bg-slate-800 border-slate-600 text-white"
          />

          <div className="flex gap-2">
            <select
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="select select-bordered bg-slate-800 border-slate-600 text-white w-full"
            >
              <option value="">Aucun événement</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowEventModal(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              +
            </button>
          </div>

          <input
            type="month"
            min="2025-01"
            max="2027-12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="input input-bordered bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={addOrUpdateContribution}
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

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#111827] p-6 rounded-xl border border-slate-700 w-96">
            <h2 className="text-lg font-semibold mb-4">Créer un événement</h2>

            <input
              type="text"
              placeholder="Nom de l'événement"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="input input-bordered bg-slate-800 border-slate-600 text-white w-full mb-3"
            />

            <textarea
              placeholder="Description (optionnel)"
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              className="textarea textarea-bordered bg-slate-800 border-slate-600 text-white w-full mb-3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                Annuler
              </button>

              <button
                onClick={createEvent}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">
        <h2 className="text-lg font-semibold mb-4">Cotisations par mois</h2>

        {months.map((m) => (
          <div key={m.month_key} className="mb-4">
            <button
              onClick={() => {
                setSelectedMonth(m.month_key);
                loadMonthDetails(m.month_key);
              }}
              className="w-full text-left px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition"
            >
              <span className="font-semibold">
                {new Date(m.month_key + "-01").toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="text-slate-400 ml-2">({m.total} cotisations)</span>
            </button>

            {selectedMonth === m.month_key && (
              <div className="mt-3 ml-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h3 className="text-md font-semibold mb-2">Détails :</h3>

                <ul className="space-y-2">
                  {details.map((c) => (
                    <li
                      key={c.id}
                      className="text-slate-300 flex justify-between items-center"
                    >
                      <span>
                        • {c.member_name} — {c.amount} GNF
                        {c.event_name && (
                          <span className="text-blue-400 ml-2">
                            (Événement : {c.event_name})
                          </span>
                        )}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(c)}
                          className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded"
                        >
                          Modifier
                        </button>

                        <button
                          onClick={() => deleteContribution(c.id)}
                          className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
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
