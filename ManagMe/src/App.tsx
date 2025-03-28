import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditProject from "./components/EditProject";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/editProject/:projectId" element={<EditProject/>}/>
      </Routes>
    </Router>
  );
}

export default App;
