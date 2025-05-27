import { useEffect, useState } from "react";

interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        await refreshToken();
        return fetchUser(); 
      }

      if (!res.ok) throw new Error("Błąd pobierania użytkownika");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  }

  async function refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
      const res = await fetch("http://localhost:3000/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Nie udało się odświeżyć tokenu");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, refreshToken };
}