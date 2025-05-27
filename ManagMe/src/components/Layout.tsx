import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Layout = () => {
  const { currentUser } = useUser();

  return (
    <div>
      <header style={{ padding: "1rem" }}>
        {currentUser ? (
          <>Zalogowany: {currentUser.firstName} {currentUser.lastName}</>
        ) : (
          <>Nie zalogowano</>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;