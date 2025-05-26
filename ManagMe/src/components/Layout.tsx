import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Layout = () => {
  const { currentUser } = useUser();

  return (
    <div>
      <header style={{ backgroundColor: "none", padding: "1rem" }}>
        Zalogowany: {currentUser.firstName} {currentUser.lastName}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;