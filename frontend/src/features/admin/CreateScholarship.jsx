import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FolderOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building,
  DollarSign
} from 'lucide-react';
import api from '../../shared/api/axiosClient';

export default function CreateScholarship() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingItem = location.state?.scholarship || null;

  const [formData, setFormData] = useState({
    sclrname: '',
    provider: '',
    amount: '',
    percentreeq: '',
    miniincome: '',
    deadline: '',
    gender: 'NULL',
    caste: 'NULL',
    educationqualifiation: 'NULL',
    application_link: '',
    draft: 0,
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        sclrname: editingItem.sclrname || '',
        provider: editingItem.provider || '',
        amount: editingItem.amount || '',
        percentreeq: editingItem.percentreeq || '',
        miniincome: editingItem.miniincome || '',
        deadline: editingItem.deadline || '',
        gender: editingItem.gender || 'NULL',
        caste: editingItem.caste || 'NULL',
        educationqualifiation: editingItem.educationqualifiation ? String(editingItem.educationqualifiation) : 'NULL',
        application_link: editingItem.application_link || '',
        draft: editingItem.draft || 0,
        description: editingItem.description || '',
      });
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sclrname) {
      setErrorMsg('Scholarship title is required');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingItem) {
        await api.put(`/update-scholarship/${editingItem.sclrid}`, formData);
        setSuccessMsg('Scholarship updated successfully!');
      } else {
        await api.post('/add-scholarship', formData);
        setSuccessMsg('New scholarship added to catalog!');
      }
      setTimeout(() => {
        navigate('/admin/view');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
            Catalog Management
          </span>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-0.5">
            {editingItem ? 'Edit Scholarship Listing' : 'Publish New Scholarship'}
          </h1>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Scholarship Program Name *
            </label>
            <input
              type="text"
              name="sclrname"
              required
              value={formData.sclrname}
              onChange={handleChange}
              placeholder="e.g. Aditya Birla Capital Scholarship"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Provider / Sponsoring Trust
            </label>
            <input
              type="text"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              placeholder="e.g. Reliance Foundation"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Grant Amount / Reward
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. ₹50,000 / year or Full Fee"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Minimum Academic Marks Required (%)
            </label>
            <input
              type="number"
              name="percentreeq"
              min="0"
              max="100"
              value={formData.percentreeq}
              onChange={handleChange}
              placeholder="e.g. 60 (Leave empty if none)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Maximum Family Income Limit (₹)
            </label>
            <input
              type="number"
              name="miniincome"
              min="0"
              value={formData.miniincome}
              onChange={handleChange}
              placeholder="e.g. 250000 (Leave empty if none)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Application Deadline (DD-MM-YYYY)
            </label>
            <input
              type="text"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              placeholder="e.g. 31-12-2027"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Official Application URL
            </label>
            <input
              type="url"
              name="application_link"
              value={formData.application_link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Gender Reservation
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            >
              <option value="NULL">Open to All Genders</option>
              <option value="Female">Female Candidates Only</option>
              <option value="Male">Male Candidates Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Caste Reservation
            </label>
            <select
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            >
              <option value="NULL">Open to All Categories</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="Minority">Minority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Target Education Level
            </label>
            <select
              name="educationqualifiation"
              value={formData.educationqualifiation}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            >
              <option value="NULL">Any Education Level</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
              <option value="13">Undergraduate (UG)</option>
              <option value="14">Postgraduate (PG)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="draft"
              name="draft"
              checked={formData.draft === 1}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="draft" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Save as Unpublished Draft (Students will not see this listing)
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Summary Description & Notes
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a concise description of eligibility and documentation..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/view')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingItem ? 'Update Scholarship' : 'Publish Scholarship'}
          </button>
        </div>
      </form>
    </div>
  );
}
