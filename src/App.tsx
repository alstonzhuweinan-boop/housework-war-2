/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FamilyProvider, useFamily } from './contexts/FamilyContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chores from './pages/Chores';
import ManageChores from './pages/ManageChores';
import History from './pages/History';
import { Loader2 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F5F2] space-y-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-stone-200 animate-ping opacity-50"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg">
          <Loader2 className="h-8 w-8 text-stone-800 animate-spin" />
        </div>
      </div>
      <p className="text-stone-500 font-bold tracking-widest animate-pulse">加载中...</p>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function FamilyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { loading: familyLoading } = useFamily();
  
  if (authLoading || familyLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <FamilyProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <FamilyRoute>
                <Layout />
              </FamilyRoute>
            }>
              <Route index element={<Navigate to="/chores" replace />} />
              <Route path="chores" element={<Chores />} />
              <Route path="manage" element={<ManageChores />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="history" element={<History />} />
            </Route>
          </Routes>
        </Router>
      </FamilyProvider>
    </AuthProvider>
  );
}
