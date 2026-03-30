import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Upload, BarChart3, Brain, Shield, ArrowRight, Star } from 'lucide-react';

const features = [
  { icon: Upload, title: 'CSV Upload', desc: 'Drag & drop your bank statement. We support any CSV format with automatic column detection.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: BarChart3, title: 'Visual Analytics', desc: 'Beautiful pie and bar charts break down your spending by category for instant clarity.', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { icon: Brain, title: 'AI Insights', desc: 'Smart suggestions tailored to your spending patterns to help you save more money.', color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
  { icon: Shield, title: 'Financial Score', desc: 'Get a 0-100 score measuring your overall financial health based on savings habits.', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
];

const stats = [
  { value: '100%', label: 'Private & Local' },
  { value: '< 5s', label: 'Analysis Time' },
  { value: '10+', label: 'Categories Tracked' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.08) 0%, transparent 60%)'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-sm font-medium mb-8">
            <Star className="w-3.5 h-3.5 fill-brand-400" />
            Intelligent Personal Finance Platform
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Master Your{' '}
            <span className="gradient-text">Money.</span>
            <br />
            Understand Your{' '}
            <span style={{ color: '#3b82f6' }}>Future.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your bank statement and instantly transform raw data into actionable insights.
            Track spending, monitor savings, and elevate your financial score.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/upload"
              className="flex items-center gap-2.5 px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-2xl shadow-xl shadow-brand-500/30 transition-all duration-200 hover:scale-105 hover:shadow-brand-500/50 text-base"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold rounded-2xl border border-white/10 transition-all duration-200 hover:border-white/20 text-base"
            >
              View Dashboard
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-14">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything you need to take control</h2>
          <p className="text-slate-400">Powerful tools, simple interface.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className={`glass rounded-2xl p-6 border ${bg} hover:scale-[1.02] transition-all duration-200 card-glow`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${bg} border`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 glass rounded-3xl p-8 sm:p-12 border border-brand-500/15 text-center card-glow">
          <TrendingUp className="w-10 h-10 text-brand-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Ready to transform your finances?</h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Upload a CSV export from your bank and get a complete financial picture in seconds. No accounts, no data sharing — everything stays on your machine.</p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200 hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            Upload Your Statement
          </Link>
        </div>
      </div>
    </div>
  );
}
