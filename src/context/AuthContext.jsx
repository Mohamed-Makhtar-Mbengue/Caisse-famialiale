import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const logoutTimer = useRef(null);

  // Durée avant déconnexion automatique (en ms)
  const AUTO_LOGOUT_DELAY = 5 * 60 * 1000; 

  // Déconnexion automatique
  const autoLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole("user");
    navigate("/admin-login");
  };

  // Reset du timer d'inactivité
  const resetTimer = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(autoLogout, AUTO_LOGOUT_DELAY);
  };

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      setUser(session?.user || null);

      const userRole = session?.user?.user_metadata?.role || "user";
      setRole(userRole);

      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);

        const userRole = session?.user?.user_metadata?.role || "user";
        setRole(userRole);

        // Reset timer à chaque changement d'état
        resetTimer();
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Gestion de l'inactivité
  useEffect(() => {
    // Événements considérés comme activité
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Lancer le timer au montage
    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
