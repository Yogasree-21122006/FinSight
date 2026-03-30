import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Upload, RefreshCw, Lightbulb } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#ec4899'];

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function ScoreGauge({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${(score / 100) * 314} 314`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>
      <span className="text-sm font-semibold mt-2" style={{ color }}>{label}</span>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 rounded-xl border border-white/10 text-xs">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-brand-400">{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, txRes] = await Promise.all([
        axios.get('/api/analytics'),
        axios.get('/api/transactions'),
      ]);
      setAnalytics(analyticsRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.transactionCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-5">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-9 h-9 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">No Data Available</h2>
          <p className="text-slate-400 max-w-sm">Upload a bank statement to generate your financial dashboard and AI insights.</p>
          <Link to="/upload" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200 hover:scale-105">
            <Upload className="w-4 h-4" /> Import Data
          </Link>
        </div>
      </div>
    );
  }

  const { totalIncome, totalExpenses, totalSavings, savingsRate, financialScore, categoryBreakdown, suggestions } = analytics;

  const statCards = [
    { icon: TrendingUp, label: 'Total Income', value: fmt(totalIncome), color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
    { icon: TrendingDown, label: 'Total Expenses', value: fmt(totalExpenses), color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { icon: DollarSign, label: 'Net Savings', value: fmt(totalSavings), color: totalSavings >= 0 ? 'text-blue-400' : 'text-red-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: Target, label: 'Transactions', value: transactions.length, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
            <p className="text-slate-400 mt-1">{transactions.length} transactions analyzed</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 glass border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={`glass rounded-2xl p-5 border ${bg} hover:scale-[1.01] transition-all duration-200`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-base font-semibold text-white mb-5">Financial Health</h2>
            <div className="flex flex-col items-center gap-5">
              <ScoreGauge score={financialScore} />
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Savings Rate</span>
                  <span className="text-brand-400 font-semibold">{savingsRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%`, background: savingsRate >= 20 ? '#10b981' : savingsRate >= 10 ? '#f59e0b' : '#ef4444' }}
                  />
                </div>
                <p className="text-xs text-slate-500">Target: 20%+</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-base font-semibold text-white mb-4">Expense by Category</h2>
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                    {categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(v) => <span className="text-xs text-slate-300">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-500 text-sm text-center mt-10">No expense data</p>}
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-base font-semibold text-white mb-4">Category Bar Chart</h2>
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryBreakdown.slice(0, 6)} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {categoryBreakdown.slice(0, 6).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-500 text-sm text-center mt-10">No data</p>}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-brand-500/15">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-brand-500/15 border border-brand-500/25 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-brand-400" />
            </div>
            <h2 className="text-base font-semibold text-white">AI-Powered Suggestions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/3 hover:bg-white/5 border border-white/5 hover:border-brand-500/20 rounded-xl transition-all duration-200">
                <span className="w-6 h-6 bg-brand-500/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-base font-semibold text-white">All Transactions</h2>
            <p className="text-xs text-slate-400 mt-0.5">{transactions.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Date', 'Description', 'Category', 'Amount', 'Type'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-3.5 text-sm text-slate-300">{t.date}</td>
                    <td className="px-6 py-3.5 text-sm text-white font-medium">{t.description}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/8">{t.category}</span>
                    </td>
                    <td className={`px-6 py-3.5 text-sm font-semibold ${t.type === 'income' ? 'text-brand-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        t.type === 'income' ? 'bg-brand-500/10 text-brand-400 border-brand-500/25' : 'bg-red-500/10 text-red-400 border-red-500/25'
                      }`}>
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
