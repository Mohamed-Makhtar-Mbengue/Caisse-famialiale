# 💼 Caisse Familiale — Plateforme de Gestion

Application web moderne permettant de gérer :
- Les membres de la famille
- Les cotisations mensuelles
- Les transactions financières
- Les projets et événements
- Le tableau de bord global

Développée avec :
- React + Vite
- Supabase (Auth, Database, RLS)
- TailwindCSS
- Vercel (déploiement)

---

## 🚀 Fonctionnalités

### 👥 Gestion des membres
- Ajout, modification, suppression (admin uniquement)
- Rôles : Président, Trésorier, Porte-parole, Membre simple…
- Dates d’anniversaire, lien de parenté

### 💰 Cotisations
- Suivi mensuel
- Détection des retards
- Calcul automatique des totaux

### 🔄 Transactions
- Entrées / sorties
- Historique complet

### 📊 Dashboard
- Solde global
- Graphiques (à venir)
- Statistiques automatiques

---

## 🔐 Sécurité

### Côté Supabase (RLS)
- Policies strictes : seuls les admins peuvent modifier les données
- Lecture ouverte pour les membres

### Côté Frontend
- Boutons admin masqués pour les utilisateurs simples
- Actions protégées
- Navigation sécurisée

---

## 🛠️ Installation

```bash
git clone https://github.com/<ton-user>/caisse-familiale.git
cd caisse-familiale
npm install
