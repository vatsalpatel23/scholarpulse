import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Building,
  Percent,
  IndianRupee,
  Users,
  Compass,
  ArrowRight,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../shared/api/axiosClient';

export default function Portal() {
  const navigate = useNavigate();
  const storedName = localStorage.getItem('name') || '';

  const [formData, setFormData] = useState({
    name: storedName,
    collegeName: '',
    marks: '',
    income: '',
    education: '12',
    caste: 'General',
    gender: 'Female',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.marks || !formData.income) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Save student questionnaire submission
      await api.post('/portal', {
        name: formData.name,
        collegeName: formData.collegeName || 'Not Specified',
        marks: Number(formData.marks),
        income: Number(formData.income),
        gender: formData.gender,
        education: Number(formData.education),
        caste: formData.caste,
      });

      // 2. Query ML Recommendation Engine
      const matchRes = await api.post('/scholarships', {
        marks: Number(formData.marks),
        income: Number(formData.income),
        education: Number(formData.education),
        caste: formData.caste,
        gender: formData.gender,
      });

      // Navigate to results page with query parameters/state
      navigate('/scholarships', {
        state: {
          studentProfile: formData,
          matchingResults: matchRes.data,
        },
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error processing scholarship matching. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setFormData({
      name: storedName || 'Vatsal Patel',
      collegeName: 'Gujarat Technological University',
      marks: '82',
      income: '180000',
      education: '12',
      caste: 'OBC',
      gender: 'Female',
    });
    setErrorMsg('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          AI Multi-Dimensional Match Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
          Student Eligibility Profile
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
          Enter your academic and socio-economic details. Our Cosine Similarity recommendation algorithm will rank high-value scholarships calibrated to your merits.
        </p>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
          >
            ⚡ Auto-fill Sample Meritorious Profile
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 space-y-8"
      >
        {/* Section 1: Personal & College Info */}
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            1. Academic Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Student Name"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                College / Institution Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  placeholder="e.g. IIT Bombay / St. Xavier's"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Metrics */}
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-600" />
            2. Academic Performance & Financial Need
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Aggregate Marks Percentage (%) *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <input
                  type="number"
                  name="marks"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={formData.marks}
                  onChange={handleChange}
                  placeholder="e.g. 85.5"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Your highest completed qualification or latest semester marks.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Annual Family Income (INR ₹) *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <input
                  type="number"
                  name="income"
                  min="0"
                  step="5000"
                  required
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="e.g. 200000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Gross combined family income as per official certificate.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Socio-demographic & Education Tier */}
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            3. Education Level & Category Reservations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Current Education Tier
              </label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
              >
                <option value="10">Class 10 (Secondary)</option>
                <option value="11">Class 11 (Higher Secondary - 1)</option>
                <option value="12">Class 12 (Higher Secondary - 2)</option>
                <option value="13">Undergraduate (UG / Degree)</option>
                <option value="14">Postgraduate (PG / Masters)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Caste Category
              </label>
              <select
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
              >
                <option value="General">General / Open</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="Minority">Minority (Muslim, Christian, Jain, etc.)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
              >
                <option value="Female">Female (Eligible for Women Grants)</option>
                <option value="Male">Male</option>
                <option value="Other">Other / Transgender</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Executing AI Cosine Ranking...
              </span>
            ) : (
              <>
                <Compass className="w-5 h-5" />
                <span>Calculate Eligible Matches</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
