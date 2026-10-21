import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Search,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  BookOpen,
  IndianRupee,
  Layers,
  Cpu,
  Github
} from 'lucide-react';

export default function LandingPage() {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  const featuredSchemes = [
    {
      title: 'Reliance Foundation UG Scheme',
      provider: 'Reliance Foundation',
      amount: 'Up to ₹2,00,000',
      match: '98%',
      category: 'Merit-cum-Means',
      deadline: '30-Nov-2027',
    },
    {
      title: 'Kotak Kanya Scholarship Program',
      provider: 'Kotak Education Foundation',
      amount: 'Up to ₹1,50,000 / year',
      match: '96%',
      category: 'Women in Higher Ed',
      deadline: '15-Dec-2027',
    },
    {
      title: 'Tata Capital Pankh Scholarship',
      provider: 'Tata Capital Ltd',
      amount: 'Up to ₹80,000',
      match: '94%',
      category: 'High School & UG',
      deadline: '26-Dec-2027',
    },
    {
      title: 'L\'Oréal India For Young Women In Science',
      provider: 'L\'Oréal India',
      amount: '₹2,50,000 grant',
      match: '92%',
      category: 'STEM Research',
      deadline: '15-Jul-2027',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-xs font-bold text-indigo-900 tracking-wide">
              Powered by Scikit-Learn Cosine Vector Similarity
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15]">
            Unlock Grants Tailored to Your{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-500 bg-clip-text text-transparent">
              Academic Potential
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ScholarPulse analyzes your academic marks, family income, and socio-demographic profile across 5 mathematical dimensions to match and rank top scholarships with precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to={token ? (role === 'admin' ? '/admin' : '/portal') : '/login'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{token ? 'Enter Discovery Portal' : 'Discover Eligible Scholarships'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Instant Demo Sign In</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-200/60 mt-8">
            <div className="p-3">
              <p className="text-2xl font-extrabold font-display text-slate-900">₹2 Cr+</p>
              <p className="text-xs text-slate-500 mt-0.5">Annual Grant Pool</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-extrabold font-display text-indigo-600">5-D Vector</p>
              <p className="text-xs text-slate-500 mt-0.5">Cosine Similarity</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-extrabold font-display text-slate-900">100% Free</p>
              <p className="text-xs text-slate-500 mt-0.5">Open For All Students</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-extrabold font-display text-emerald-600">Active</p>
              <p className="text-xs text-slate-500 mt-0.5">Real-time Deadlines</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / 4-Step Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Machine Learning Pipeline
          </span>
          <h2 className="text-3xl font-extrabold font-display text-slate-900 mt-1">
            How The Recommendation Engine Operates
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            Decoupled multi-stage intelligence moving from database constraint pruning to normalized vector mathematics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Profile Submission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Student enters aggregate percentage, gross family income, caste category, gender, and education tier.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Constraint Filtering</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Database-level checks filter out scholarships where student does not meet hard eligibility thresholds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Vector Normalization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Feature vector <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] text-slate-800">[Income, Marks, Caste, Gender, Edu]</code> is built and scored via Cosine Similarity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900">Ranked Results</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Eligible grants are displayed sorted by match percentage with live deadline countdowns and official application links.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Top Catalog Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
              Popular National & Corporate Grants
            </h2>
          </div>
          <Link
            to="/login"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All 16+ Grants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredSchemes.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {item.match} Match
                  </span>
                </div>
                <h4 className="font-bold font-display text-slate-900 text-sm mt-1 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.provider}</p>

                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 text-slate-900 font-bold text-xs">
                  {item.amount}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Deadline: {item.deadline}</span>
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Apply →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Github className="w-3.5 h-3.5" />
              Open-Source Project
            </span>
            <h3 className="text-2xl font-bold font-display">
              Engineered by Vatsal Patel
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
              Explore the full codebase, machine learning vector implementation, and deployment scripts on GitHub at{' '}
              <a
                href="https://github.com/vatsalpatel23"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 font-semibold underline"
              >
                github.com/vatsalpatel23
              </a>.
            </p>
          </div>

          <a
            href="https://github.com/vatsalpatel23"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition shadow-md flex items-center gap-2 shrink-0"
          >
            <Github className="w-4 h-4" />
            <span>Visit GitHub Profile</span>
          </a>
        </div>
      </section>
    </div>
  );
}
