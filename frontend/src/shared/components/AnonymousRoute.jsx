import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AnonymousRoute() {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (token) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/portal" replace />;
  }

  return <Outlet />;
}
