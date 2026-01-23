import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Predictor from "./pages/Predictor";

function App() {
  return (
    <Router>
      {/* FIX: Changed bg-slate-50 to bg-transparent */}
      <div className="min-h-screen pt-16 bg-transparent">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Predictor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
