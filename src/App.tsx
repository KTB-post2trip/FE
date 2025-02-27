import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Search";
import Map from "./pages/map";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;
