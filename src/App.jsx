import "./App.css";
import TelaLogin from "./Pages/Login/TelaLogin";
import Home from "./Pages/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/recibos" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
