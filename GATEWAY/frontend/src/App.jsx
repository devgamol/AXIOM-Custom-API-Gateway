// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Services from './pages/dashboard/Services';
import ApiRoutes from './pages/dashboard/Routes';
import ApiKeys from './pages/dashboard/ApiKeys';
import RateLimits from './pages/dashboard/RateLimits';
import Logs from './pages/dashboard/Logs';
import Settings from './pages/dashboard/Settings';

import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="services" element={<Services />} />
          <Route path="routes" element={<ApiRoutes />} />
          <Route path="apikeys" element={<ApiKeys />} />
          <Route path="ratelimits" element={<RateLimits />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </>
  );
}

export default App;
