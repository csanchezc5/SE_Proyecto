import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Habitaciones from './pages/Habitaciones';
import Reportes from './pages/Reportes';
import Reservas from './pages/Reservas';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/habitaciones" element={<Habitaciones />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/reservas" element={<Reservas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;