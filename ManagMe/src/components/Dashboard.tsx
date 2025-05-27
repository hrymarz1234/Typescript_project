import React from "react";
import { useAuth } from "./useAuth";

function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Nie jesteś zalogowany</p>;

  return (
    <div>
      <h2>Witaj, {user.firstName} {user.lastName}!</h2>
      <p>Twoje ID: {user.id}</p>
    </div>
  );
}

export default Dashboard;