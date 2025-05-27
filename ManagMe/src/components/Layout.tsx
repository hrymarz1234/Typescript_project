import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";

const Layout = () => {
  const { currentUser } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      style={{ backgroundColor: darkMode ? '#111827' : '#ffffff' }}
      className={`min-h-screen ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}
    >
      <header
        className={`flex justify-between items-center p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-300'
        }`}
      >
        <div>
          {currentUser ? (
            <>Zalogowany: {currentUser.firstName} {currentUser.lastName}</>
          ) : (
            <>Nie zalogowano</>
          )}
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1 border rounded ${
            darkMode ? 'border-gray-400' : 'border-gray-500'
          }`}
        >
          {darkMode ? 'Tryb jasny' : 'Tryb ciemny'}
        </button>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;