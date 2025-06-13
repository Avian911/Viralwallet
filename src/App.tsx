import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardLayout from './components/dashboard/DashboardLayout';
import CustomerHome from './components/dashboard/customer/CustomerHome';
import OrderServices from './components/dashboard/customer/OrderServices';
import Wallet from './components/dashboard/customer/Wallet';
import OrderHistory from './components/dashboard/customer/OrderHistory';
import Support from './components/dashboard/customer/Support';
import AdminHome from './components/dashboard/admin/AdminHome';
import ManageUsers from './components/dashboard/admin/ManageUsers';
import ManageOrders from './components/dashboard/admin/ManageOrders';
import WalletRequests from './components/dashboard/admin/WalletRequests';
import SupportTickets from './components/dashboard/admin/SupportTickets';
import ServiceSettings from './components/dashboard/admin/ServiceSettings';
import { startOrderProcessor } from './services/orderProcessor';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  useEffect(() => {
    // Start the order processor for auto-completing orders
    startOrderProcessor();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CustomerHome />} />
            <Route path="order-services" element={<OrderServices />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="support" element={<Support />} />
            
            {/* Admin Routes */}
            <Route path="admin-home" element={
              <AdminRoute>
                <AdminHome />
              </AdminRoute>
            } />
            <Route path="manage-users" element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            } />
            <Route path="manage-orders" element={
              <AdminRoute>
                <ManageOrders />
              </AdminRoute>
            } />
            <Route path="wallet-requests" element={
              <AdminRoute>
                <WalletRequests />
              </AdminRoute>
            } />
            <Route path="support-tickets" element={
              <AdminRoute>
                <SupportTickets />
              </AdminRoute>
            } />
            <Route path="service-settings" element={
              <AdminRoute>
                <ServiceSettings />
              </AdminRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;