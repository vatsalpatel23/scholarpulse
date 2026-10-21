import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ExternalLink,
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  X,
  Building,
  Award,
  ChevronRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import api from '../../shared/api/axiosClient';

export default function ScholarshipResult() {
  const location = useLocation();
  const initialResults = location.state?.matchingResults || [];
  const initialProfile = location.state?.studentProfile || null;

  const [scholarships, setScholarships] = useState(initialResults);
  const [loading, setLoading] = useState(initialResults.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('MATCH'); // MATCH | DEADLINE
  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    if (initialResults.length === 0) {
      // Fetch default matching scholarships
      fetchDefaultScholarships();
    }
  }, []);

  const fetchDefaultScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.post('/scholarships', {
        marks: 75,
        income: 250000,
        education: 12,
        caste: 'General',
        gender: 'All',
      });
      setScholarships(res.data);
    } catch (err) {
      console.error('Error fetching scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search
  const filteredScholarships = scholarships
    .filter((s) => {
      const matchSearch =
        s.sclrname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.provider && s.provider.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (selectedCategoryFilter === 'FEMALE') {
        return s.gender && s.gender.toLowerCase() === 'female';
      }
      if (selectedCategoryFilter === 'ACTIVE_ONLY') {
        return s.is_active;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'MATCH') {
        return (b.recommendation_score || 0) - (a.recommendation_score || 0);
      }
      if (sortBy === 'DEADLINE') {
        return (a.days_left || 999) - (b.days_left || 999);
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              ML Scored Results
            </span>
            {initialProfile && (
              <span className="text-xs text-slate-500 font-medium">
                Targeting: {initialProfile.marks}% Marks | Max ₹{Number(initialProfile.income).toLocaleString()} Income
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Personalized Scholarship Recommendations
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Found <span className="font-bold text-indigo-600">{filteredScholarships.length}</span> eligible schemes evaluated via multi-dimensional cosine similarity.
          </p>
        </div>

        <Link
          to="/portal"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors w-fit"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Edit Eligibility Profile
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by scholarship or sponsor name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        {/* Filter Pills and Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategoryFilter === 'ALL'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('FEMALE')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategoryFilter === 'FEMALE'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Women Only
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('ACTIVE_ONLY')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategoryFilter === 'ACTIVE_ONLY'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Open Applications
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="MATCH">Sort: Highest Match Score</option>
            <option value="DEADLINE">Sort: Deadline Approaching</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-700">Evaluating multi-dimensional criteria...</p>
          <p className="text-xs text-slate-400">Applying Cosine Vector Similarity matrix</p>
        </div>
      ) : filteredScholarships.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold font-display text-slate-900">No Scholarships Match Query</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Try adjusting your search keywords, or broaden your eligibility criteria in the Profile Matcher.
          </p>
          <Link
            to="/portal"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-md transition"
          >
            Update Eligibility Profile
          </Link>
        </div>
      ) : (
        /* Scholarship Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((s) => {
            const matchScore = s.match_percentage || 85;
            const daysLeft = s.days_left ?? 30;
            const isUrgent = daysLeft <= 15 && daysLeft >= 0;

            return (
              <div
                key={s.sclrid}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Header & Badges */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Match Score Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold shadow-sm">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{matchScore}% Match</span>
                    </div>

                    {/* Deadline Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        !s.is_active
                          ? 'bg-slate-100 text-slate-500'
                          : isUrgent
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {!s.is_active
                        ? 'Application Closed'
                        : daysLeft === 0
                        ? 'Closing Today'
                        : `${daysLeft} days left`}
                    </span>
                  </div>

                  {/* Provider */}
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {s.provider || 'National Grant Scheme'}
                  </p>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {s.sclrname}
                  </h3>

                  {/* Award Amount Pill */}
                  <div className="mt-3 inline-block px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                    <span className="text-[10px] uppercase tracking-wider text-amber-700 block">
                      Grant Reward
                    </span>
                    {s.amount || 'Tuition Assistance'}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                    {s.description || 'Scholarship designed to assist students meeting academic and income eligibility benchmarks.'}
                  </p>

                  {/* Criteria Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
                    {s.percentreeq && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        Min {s.percentreeq}% Marks
                      </span>
                    )}
                    {s.miniincome && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        Income &lt; ₹{(s.miniincome / 100000).toFixed(1)}L
                      </span>
                    )}
                    {s.caste && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                        {s.caste}
                      </span>
                    )}
                    {s.gender && s.gender.toLowerCase() === 'female' && (
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-semibold border border-pink-100">
                        Women Reservation
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(s)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    AI Vector Breakdown
                  </button>

                  <a
                    href={s.application_link && s.application_link !== '#' ? s.application_link : 'https://scholarships.gov.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <span>Apply Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Vector Breakdown Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Cosine Similarity Analysis
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 mt-1">
                  {activeModalItem.sclrname}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Score */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Normalized Vector Cosine Score</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {activeModalItem.recommendation_score || 0.95} / 1.0000
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-700">Calculated Match</span>
                <p className="text-2xl font-extrabold text-emerald-600">
                  {activeModalItem.match_percentage}%
                </p>
              </div>
            </div>

            {/* 5 Dimensions Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Multi-Dimensional Dimension Alignments
              </h4>

              {/* Dimension 1: Academic Fit */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">1. Academic Merit Alignment</span>
                  <span className="font-bold text-indigo-600">
                    {activeModalItem.dimension_breakdown?.academic_fit || 85}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${activeModalItem.dimension_breakdown?.academic_fit || 85}%` }}
                  />
                </div>
              </div>

              {/* Dimension 2: Financial Need */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">2. Financial Need Ratio</span>
                  <span className="font-bold text-emerald-600">
                    {activeModalItem.dimension_breakdown?.income_fit || 90}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${activeModalItem.dimension_breakdown?.income_fit || 90}%` }}
                  />
                </div>
              </div>

              {/* Dimension 3: Category Reservation */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">3. Category Affinity Weighting</span>
                  <span className="font-bold text-purple-600">
                    {activeModalItem.dimension_breakdown?.category_fit || 95}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${activeModalItem.dimension_breakdown?.category_fit || 95}%` }}
                  />
                </div>
              </div>

              {/* Dimension 4: Gender Reservation */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">4. Gender Affirmative Action Fit</span>
                  <span className="font-bold text-pink-600">
                    {activeModalItem.dimension_breakdown?.gender_fit || 80}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all"
                    style={{ width: `${activeModalItem.dimension_breakdown?.gender_fit || 80}%` }}
                  />
                </div>
              </div>

              {/* Dimension 5: Qualification Tier */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">5. Education Qualification Tier</span>
                  <span className="font-bold text-amber-600">
                    {activeModalItem.dimension_breakdown?.education_fit || 100}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${activeModalItem.dimension_breakdown?.education_fit || 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
