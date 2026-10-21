import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import api from '../../shared/api/axiosClient';

export default function ViewScholarships() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const res = await api.get('/admin-scholarships');
      setScholarships(res.data);
    } catch (err) {
      console.error('Error fetching admin scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }
    try {
      await api.delete(`/delete-scholarship/${id}`);
      setScholarships((prev) => prev.filter((s) => s.sclrid !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete scholarship');
    }
  };

  const filtered = scholarships.filter((s) =>
    s.sclrname.toLowerCase().includes(search.toLowerCase()) ||
    (s.provider && s.provider.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
            Catalog Management
          </span>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-0.5">
            Published Scholarships & Grants
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total of {scholarships.length} active and archived funding schemes
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/manage')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Scholarship</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search catalog by name or sponsor..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No scholarships matching search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Scheme Details</th>
                  <th className="py-3 px-4">Reward</th>
                  <th className="py-3 px-4">Thresholds</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.sclrid} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{s.sclrname}</p>
                      <p className="text-[11px] text-slate-400">{s.provider || 'National Foundation'}</p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {s.amount || 'Tuition Aid'}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="text-[11px]">Marks: {s.percentreeq ? `${s.percentreeq}%` : 'Open'}</p>
                      <p className="text-[11px]">Income: {s.miniincome ? `≤ ₹${(s.miniincome / 100000).toFixed(1)}L` : 'Open'}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {s.deadline || 'Ongoing'}
                    </td>

                    <td className="py-3.5 px-4">
                      {s.draft === 1 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Draft
                        </span>
                      ) : s.is_active ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          Expired
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => navigate('/admin/manage', { state: { scholarship: s } })}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Listing"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.sclrid, s.sclrname)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
