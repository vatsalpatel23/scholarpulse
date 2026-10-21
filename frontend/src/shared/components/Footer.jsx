import React from 'react';
import { GraduationCap, Heart, Github, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-display text-white">
                ScholarPulse AI
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Next-generation Machine Learning scholarship recommendation ecosystem. Matching aspiring students with life-changing academic grants through multi-dimensional cosine similarity ranking.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/vatsalpatel23"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-medium transition-colors border border-slate-700"
              >
                <Github className="w-4 h-4 text-indigo-400" />
                <span>GitHub @vatsalpatel23</span>
              </a>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ML Engine Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 font-display text-sm tracking-wider uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">Home Discovery</a>
              </li>
              <li>
                <a href="/portal" className="hover:text-white transition-colors">Profile Matcher</a>
              </li>
              <li>
                <a href="/scholarships" className="hover:text-white transition-colors">Scholarship Catalog</a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">Account Portal</a>
              </li>
            </ul>
          </div>

          {/* Engineering Tech */}
          <div>
            <h4 className="text-white font-semibold mb-3 font-display text-sm tracking-wider uppercase">
              Technology Stack
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Python 3 / Flask Microservices</li>
              <li>• Scikit-Learn Cosine Similarity</li>
              <li>• React 19 + Vite 6 + Tailwind CSS</li>
              <li>• JWT Refresh Token Rotation</li>
              <li>• SQLite & MySQL Hybrid Engine</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-1.5">
            Designed & Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by{' '}
            <a
              href="https://github.com/vatsalpatel23"
              target="_blank"
              rel="noreferrer"
              className="text-white font-semibold hover:text-indigo-400 transition-colors underline decoration-indigo-500 underline-offset-4"
            >
              Vatsal Patel
            </a>
          </p>
          <p className="text-slate-500">
            © {new Date().getFullYear()} ScholarPulse AI. All rights reserved. Open-source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
