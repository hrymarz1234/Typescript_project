import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

declare global {
  interface Window {
    google: any;
  }
}

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "",
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

const handleGoogleResponse = async (response: any) => {
  try {
    const res = await fetch("http://localhost:4000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    });

    if (!res.ok) throw new Error("Google login failed");
    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));


    setCurrentUser({
      ...data.user,
      id: Number(data.user.id),
    });

    alert("Zalogowano przez Google jako gość!");
    navigate("/home");
  } catch (err) {
    alert("Błąd logowania przez Google");
  }
};

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (!res.ok) throw new Error("Błędne dane logowania");

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setCurrentUser(data.user);

      alert("Zalogowano!");
      navigate("/home");
    } catch (err) {
      alert("Błąd logowania");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Zaloguj</button>
      </form>

      <div id="google-login-btn" style={{ marginTop: "20px" }}></div>
    </>
  );
}


export default Login;