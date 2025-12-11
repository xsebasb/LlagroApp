import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage';
import ConfigPage from './pages/ConfigPage';
import ReportsPage from './pages/ReportsPage';
import VehiclesPage from './pages/VehiclesPage';
import InspectionPage from './pages/InspectionPage';
import AddTirePage from './pages/AddTirePage';
import LoginPage from './pages/LoginPage';
import InternalUsersPage from './pages/InternalUsersPage';

// Auth Guard Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('auth_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Application Routes */}
        <Route path="/" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
        <Route path="/clients/:clientId/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
        <Route path="/inspection/:vehicleId" element={<ProtectedRoute><InspectionPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/config" element={<ProtectedRoute><ConfigPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><InternalUsersPage /></ProtectedRoute>} />
        <Route path="/add-tire" element={<ProtectedRoute><AddTirePage /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
};

export default App;