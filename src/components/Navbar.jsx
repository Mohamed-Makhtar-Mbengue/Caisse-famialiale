export default function Navbar() {
  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="navbar bg-base-200 fixed top-0 left-0 z-50 shadow">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Caisse Familiale</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a onClick={() => scrollTo("home")}>Accueil</a></li>
          <li><a onClick={() => scrollTo("members")}>Membres</a></li>
          <li><a onClick={() => scrollTo("contributions")}>Cotisations</a></li>
          <li><a onClick={() => scrollTo("transactions")}>Transactions</a></li>
          <li><a onClick={() => scrollTo("dashboard")}>Dashboard</a></li>
        </ul>
      </div>
    </div>
  );
}
