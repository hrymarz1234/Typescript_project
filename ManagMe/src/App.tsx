import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Home from "./pages/Home";
import EditProject from "./components/EditProject";
import EditStory from "./components/EditStory";

const mockUser = {
  id: 1,
  firstName: "Jan",
  lastName: "Kowalski",
};

function App() {
  return (
    <UserContext.Provider value={mockUser}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editProject/:projectId" element={<EditProject />} />
            <Route path="/editStory/:storyId" element={<EditStory />} />
          </Routes>
        </Router>
    </UserContext.Provider>
  );
}

export default App;
