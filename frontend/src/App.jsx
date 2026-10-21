import React from 'react';
import Navbar from './shared/components/Navbar';
import Footer from './shared/components/Footer';
import AppRoutes from './app/AppRoutes';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}
