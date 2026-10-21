import React, { useEffect, useState } from 'react';
import { GraduationCap, Search, Download } from 'lucide-react';
import api from '../../shared/api/axiosClient';

export default function StudentsDetails() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin-students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) =>
    (s.stdname && s.stdname.toLowerCase().includes(search.toLowerCase())) ||
    (s.collegeName && s.collegeName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
            Applicant Audit Log
          </span>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-0.5">
            Student Questionnaire Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of all student profiles submitted for ML vector recommendations
          </p>
        </div>
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
          placeholder="Filter by applicant or college name..."
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
          <p className="text-sm font-semibold text-slate-600">No student submissions recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">College / School</th>
                  <th className="py-3 px-4">Marks %</th>
                  <th className="py-3 px-4">Family Income</th>
                  <th className="py-3 px-4">Demographics</th>
                  <th className="py-3 px-4">Education Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.stdid} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {s.stdname}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {s.collegeName || 'Not Disclosed'}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-indigo-600">
                      {s.stdpercent}%
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      ₹{Number(s.stdincome || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 space-x-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {s.stdgender}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[11px]">
                        {s.caste}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      Tier {s.education}
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
