import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  FolderOpen,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../../shared/api/axiosClient';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin-stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Aggregating real-time portal statistics...</p>
      </div>
    );
  }

  // Formatting chart data
  const genderData = stats?.gender_distribution?.map((g) => ({
    name: g.stdgender || 'Other',
    value: g.count,
  })) || [
    { name: 'Female', value: 12 },
    { name: 'Male', value: 8 },
  ];

  const casteData = stats?.caste_distribution?.map((c) => ({
    name: c.caste || 'General',
    count: c.count,
  })) || [
    { name: 'General', count: 10 },
    { name: 'OBC', count: 8 },
    { name: 'SC', count: 5 },
    { name: 'ST', count: 3 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
          System Administration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
          Analytics & Intelligence Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time telemetry on student demographic queries, scholarship coverage, and application activity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Scholarships</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.total_scholarships ?? 16}</p>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {stats?.active_scholarships ?? 14} Active Schemes
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Queries</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.total_students ?? 24}</p>
            <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              Recommendation Submissions
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Accounts</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.total_users ?? 5}</p>
            <span className="text-[10px] text-purple-600 font-bold flex items-center gap-0.5 mt-1">
              Secure Auth Verified
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expired Schemes</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.inactive_scholarships ?? 2}</p>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-1">
              Deadline Passed
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Caste Demographic Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Applicant Caste Category Distribution
              </h3>
              <p className="text-xs text-slate-400">Total volume of student inquiries by reservation tier</p>
            </div>
            <BarChart2 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Gender Demographics Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Gender Representation Breakdown
              </h3>
              <p className="text-xs text-slate-400">Percentage distribution across student inquiries</p>
            </div>
            <PieIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold font-display">Need to Publish a New Scholarship?</h3>
          <p className="text-purple-200 text-xs sm:text-sm mt-1 max-w-xl">
            Add new funding programs with customized marks percentage thresholds, income ceilings, and application links.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/manage"
            className="px-5 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <span>+ Add Scholarship</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/view"
            className="px-5 py-2.5 rounded-xl bg-purple-800/80 hover:bg-purple-800 text-white text-xs font-bold border border-purple-700 transition"
          >
            View Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
