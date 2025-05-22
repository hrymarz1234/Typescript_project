import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext, User } from "./context/UserContext";
import Home from "./pages/Home";
import Task from './pages/Task';
import EditProject from "./components/EditProject";
import EditStory from "./components/EditStory";


function App() {

  const users: User[] = [
  {
    id: 1,
    firstName: "Jan",
    lastName: "Kowalski",
    role: "admin"
  },
  {
    id: 2,
    firstName: "Adrian",
    lastName: "Nowak",
    role: "devops"
  },
  {
    id: 3,
    firstName: "Sławomir",
    lastName: "Kluszczyński",
    role: "developer"
  }
];

const currentUser = users.find(u => u.role === "admin")!;

  return (
    <UserContext.Provider value={{ currentUser, allUsers: users }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editProject/:projectId" element={<EditProject />} />
            <Route path="/editStory/:storyId" element={<EditStory />} />
            <Route path="/task/:storyId" element={<Task />} />
          </Routes>
        </Router>
    </UserContext.Provider>
  );
}

export default App;
