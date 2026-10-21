import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout & Route Guards
import ProtectedRoute from '../shared/components/ProtectedRoute';
import AnonymousRoute from '../shared/components/AnonymousRoute';

// Pages
import LandingPage from '../shared/pages/LandingPage';
import NotFoundPage from '../shared/pages/NotFoundPage';

// Auth Features
import Login from '../features/auth/Login';
import Signup from '../features/auth/Signup';
import PasswordUpdate from '../features/auth/PasswordUpdate';

// Student Features
import Portal from '../features/scholarship/Portal';
import ScholarshipResult from '../features/scholarship/ScholarshipResult';

// Admin Features
import AdminLayout from '../features/admin/AdminLayout';
import AdminDashboard from '../features/admin/AdminDashboard';
import CreateScholarship from '../features/admin/CreateScholarship';
import ViewScholarships from '../features/admin/ViewScholarships';
import StudentsDetails from '../features/admin/StudentsDetails';
import UsersDetails from '../features/admin/UsersDetails';
import AdminPassUpdate from '../features/admin/AdminPassUpdate';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Homepage */}
      <Route path="/" element={<LandingPage />} />

      {/* Anonymous Guest Only Routes */}
      <Route element={<AnonymousRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Shared Protected Account Route */}
      <Route
        path="/update-password"
        element={
          <ProtectedRoute>
            <PasswordUpdate />
          </ProtectedRoute>
        }
      />

      {/* Student Protected Portal Routes */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute allowedRole="student">
            <Portal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scholarships"
        element={
          <ProtectedRoute allowedRole="student">
            <ScholarshipResult />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Console Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="manage" element={<CreateScholarship />} />
        <Route path="view" element={<ViewScholarships />} />
        <Route path="students" element={<StudentsDetails />} />
        <Route path="users" element={<UsersDetails />} />
        <Route path="admin-updatepassword" element={<AdminPassUpdate />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
