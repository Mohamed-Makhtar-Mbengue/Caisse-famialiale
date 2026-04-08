import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Members() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [lienParente, setLienParente] = useState("");
  const [dateAnniversaire, setDateAnniversaire] = useState("");

  // Charger les membres
  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("name");

    if (error) console.error("Erreur fetch:", error);
    setMembers(data || []);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPhone("");
    setMemberRole("");
    setLienParente("");
    setDateAnniversaire("");
  };

  // Ajouter ou modifier un membre
  const saveMember = async () => {
    if (!isAdmin) return alert("Accès refusé : réservé aux admins.");
    if (!name || !memberRole) return;

    const payload = {
      name,
      phone,
      role: memberRole,
      lien_parente: lienParente,
      date_anniversaire: dateAnniversaire,
    };

    let result;

    if (editingId) {
      result = await supabase
        .from("members")
        .update(payload)
        .eq("id", editingId);
    } else {
      result = await supabase.from("members").insert([payload]);
    }

    if (result.error) {
      console.error("Erreur Supabase:", result.error);
      alert("Erreur : " + result.error.message);
      return;
    }

    await fetchMembers();
    resetForm();
  };

  // Pré-remplir le formulaire pour modification
  const startEdit = (m) => {
    if (!isAdmin) return alert("Accès refusé : réservé aux admins.");

    setEditingId(m.id);
    setName(m.name);
    setPhone(m.phone);
    setMemberRole(m.role);
    setLienParente(m.lien_parente || "");
    setDateAnniversaire(m.date_anniversaire || "");
  };

  // Supprimer un membre
  const deleteMember = async (id) => {
    if (!isAdmin) return alert("Accès refusé : réservé aux admins.");

    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) console.error("Erreur delete:", error);

    fetchMembers();
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const displayRole = (r) => (r === "Membre simple" ? "Membre" : r);

  return (
    <div className="space-y-10 text-white">

      <h1 className="text-3xl font-semibold">Gestion des membres</h1>

      {/* Formulaire visible uniquement pour les admins */}
      {isAdmin && (
        <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">

          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Modifier un membre" : "Ajouter un membre"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered bg-slate-800 border-slate-600 text-white"
            />

            <input
              type="text"
              placeholder="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input input-bordered bg-slate-800 border-slate-600 text-white"
            />

            <select
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value)}
              className="select select-bordered bg-slate-800 border-slate-600 text-white"
            >
              <option value="">Choisir un rôle</option>
              <option value="Président">Président</option>
              <option value="Vice-président">Vice-président</option>
              <option value="Secrétaire Général">Secrétaire Général</option>
              <option value="Trésorier">Trésorier</option>
              <option value="Porte-parole">Porte-parole</option>
              <option value="Membre">Membre</option>
              <option value="Membre simple">Membre simple</option>
            </select>

            <input
              type="text"
              placeholder="Lien de parenté"
              value={lienParente}
              onChange={(e) => setLienParente(e.target.value)}
              className="input input-bordered bg-slate-800 border-slate-600 text-white"
            />

            <input
              type="date"
              placeholder="Date anniversaire"
              value={dateAnniversaire}
              onChange={(e) => setDateAnniversaire(e.target.value)}
              className="input input-bordered bg-slate-800 border-slate-600 text-white"
            />

          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={saveMember}
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

      {/* Tableau */}
      <div className="bg-[#111827] p-6 rounded-xl border border-slate-700">

        <h2 className="text-lg font-semibold mb-4">Liste des membres</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-3 px-2 text-slate-400">Nom</th>
              <th className="py-3 px-2 text-slate-400">Parenté</th>
              <th className="py-3 px-2 text-slate-400">Téléphone</th>
              <th className="py-3 px-2 text-slate-400">Rôle</th>
              <th className="py-3 px-2 text-slate-400">Anniversaire</th>
              <th className="py-3 px-2 text-slate-400">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-slate-700">

                <td className="py-3 px-2">{m.name}</td>
                <td className="py-3 px-2">{m.lien_parente || "-"}</td>
                <td className="py-3 px-2">{m.phone}</td>
                <td className="py-3 px-2">{displayRole(m.role)}</td>

                <td className="py-3 px-2">
                  {m.date_anniversaire
                    ? new Date(m.date_anniversaire).toLocaleDateString("fr-FR")
                    : "-"}
                </td>

                <td className="py-3 px-2 flex gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => startEdit(m)}
                        className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => deleteMember(m.id)}
                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                      >
                        Supprimer
                      </button>
                    </>
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
