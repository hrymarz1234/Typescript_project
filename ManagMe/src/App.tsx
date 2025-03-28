import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditProject from "./components/EditProject";
import EditStory from "./components/EditStory";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/editProject/:projectId" element={<EditProject/>}/>
        <Route path="/editStory/:storyId" element={<EditStory/>}/>
      </Routes>
    </Router>
  );
}

export default App;
