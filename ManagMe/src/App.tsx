import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext, User } from "./context/UserContext";
import Home from "./pages/Home";
import Task from './pages/Task';
import EditProject from "./components/EditProject";
import EditStory from "./components/EditStory";
import TaskDetails from "./components/TaskDetails";
import KanbanPage from "./components/KanbanPage";
import Layout from "./components/Layout"; 
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import { useEffect, useState } from "react";


function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setCurrentUser(JSON.parse(storedUser));
  }
}, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, allUsers }}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/editProject/:projectId" element={<EditProject />} />
            <Route path="/editStory/:storyId" element={<EditStory />} />
            <Route path="/task/:storyId" element={<Task />} />
            <Route path="/tasks/:storyId/:taskId" element={<TaskDetails />} />
            <Route path="/kanban/:storyId" element={<KanbanPage />} />
          </Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;