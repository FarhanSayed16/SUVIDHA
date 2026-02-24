import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Analytics from './pages/Analytics';
import Advisories from './pages/Advisories';
import ProtectedRoute from './components/ProtectedRoute';
import SessionManager from './components/SessionManager';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* DEMO MODE WARNING BANNER */}
      <div className="bg-red-600 text-white text-xs sm:text-sm text-center font-bold tracking-[0.2em] py-1.5 w-full z-[9999] top-0 sticky shadow-lg uppercase">
        Demonstration Environment - No Real Transactions Processed
      </div>
      <SessionManager />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/advisories" element={<Advisories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
