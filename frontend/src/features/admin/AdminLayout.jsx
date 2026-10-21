import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Users,
  GraduationCap,
  KeyRound,
  LogOut,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('name') || 'Administrator';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { name: 'Analytics Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Add New Scholarship', path: '/admin/manage', icon: PlusCircle },
    { name: 'Scholarship Catalog', path: '/admin/view', icon: FolderOpen },
    { name: 'Student Submissions', path: '/admin/students', icon: GraduationCap },
    { name: 'Registered Users', path: '/admin/users', icon: Users },
    { name: 'Security Credentials', path: '/admin/admin-updatepassword', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center gap-2.5 pb-6 mb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-display text-slate-900 leading-tight">
                Admin Console
              </h2>
              <p className="text-[11px] text-slate-500">ScholarPulse System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">{adminName}</p>
            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
              Root Administrator
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
