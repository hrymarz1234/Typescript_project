import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";

const Layout = () => {
  const { currentUser } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
    >
      <header
        className={`flex justify-between items-center p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-300'
        }`}
      >
        <div className={darkMode ? 'text-gray-100' : 'text-gray-900'}>
          {currentUser ? (
            <>Zalogowany: {currentUser.firstName} {currentUser.lastName}</>
          ) : (
            <>Nie zalogowano</>
          )}
        </div>
        <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1 border rounded transition-colors ${
              darkMode
                ? 'bg-transparent text-gray-100 border-gray-400'
                : 'bg-gray-200 text-black border-gray-400'
            }`}
          >
            {darkMode ? 'Tryb jasny' : 'Tryb ciemny'}
          </button>
      </header>

      <main
        className={`p-4 ${!darkMode ? 'button-light-mode' : ''}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;