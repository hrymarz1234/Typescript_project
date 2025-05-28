import { useEffect, useState } from "react";

interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  role: "admin" | "devops" | "developer" | "guest";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return fetchUser();
        } else {
          setUser(null);
          return;
        }
      }

      if (!res.ok) throw new Error("Błąd pobierania użytkownika");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  }

  async function refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    try {
      const res = await fetch("http://localhost:4000/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Nie udało się odświeżyć tokenu");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      return true;
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return false;
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, refreshToken };
}