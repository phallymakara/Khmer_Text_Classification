import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Predictor from "./pages/Predictor";

function App() {
  return (
    <Router>
      <div className="min-h-screen pt-16 bg-slate-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Predictor />} />
          </Routes>
        </main>
        {/* Footer is removed from here */}
      </div>
    </Router>
  );
}

export default App;
