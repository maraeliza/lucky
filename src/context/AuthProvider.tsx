"use client";

import { AuthContextProps, UserData } from "@/interfaces/common";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      const res = await fetch("/api/me", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        router.push("/auth");
        console.warn("Falha ao deslogar:", res.status, res.statusText);
      }
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  }, [router]);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.warn(
          "⚠️ Resposta não OK do /api/me:",
          res.status,
          res.statusText
        );
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Erro ao carregar usuário:", err);
      setUser(null);
    } finally {
      console.log("⏹ Finalizando loadUser. setLoading(false)");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const redirectToInitialPage = useCallback(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.push("/auth");
      return;
    }

    if (user.role === "ADMIN") {
      router.push("/home-admin");
      return;
    }

    if (user.role === "CLIENT") {
      router.push("/home-client");
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    redirectToInitialPage();
  }, [redirectToInitialPage]);

  useEffect(() => {}, [user, loading]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
