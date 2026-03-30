import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, FileText, CheckCircle, AlertCircle, Download, Trash2, X, Loader2, Info } from 'lucide-react';
import axios from 'axios';

const SAMPLE_CSV = `Date,Description,Category,Amount,Type
2024-01-03,Monthly Salary,Income,5000,income
2024-01-05,Rent Payment,Housing,1200,expense
2024-01-06,Grocery Store,Food,180,expense
2024-01-08,Netflix,Entertainment,15.99,expense
2024-01-09,Uber Ride,Transport,22.50,expense
2024-01-10,Restaurant Dinner,Food,65,expense
2024-01-12,Electric Bill,Utilities,88,expense
2024-01-14,Gym Membership,Health,45,expense
2024-01-15,Online Shopping,Shopping,130,expense
2024-01-17,Coffee Shop,Food,38,expense
2024-01-18,Pharmacy,Healthcare,28,expense
2024-01-20,Spotify Premium,Entertainment,9.99,expense
2024-01-22,Gas Station,Transport,55,expense
2024-01-24,Freelance Income,Income,800,income
2024-01-25,New Clothes,Shopping,120,expense
2024-01-27,Internet Bill,Utilities,60,expense
2024-01-28,Doctor Visit,Healthcare,150,expense
2024-01-29,Movie Tickets,Entertainment,32,expense
2024-01-30,Grocery Store,Food,95,expense
2024-01-31,Investment Return,Income,250,income`;

export default function Upload() {
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [clearing, setClearing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith('.csv')) { setError('Please upload a CSV file.'); return; }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post('/api/transactions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Delete all transactions? This cannot be undone.')) return;
    setClearing(true);
    try {
      await axios.delete('/api/transactions');
      setResult(null);
      setFile(null);
      alert('All transactions cleared!');
    } catch {
      alert('Failed to clear transactions.');
    } finally {
      setClearing(false);
    }
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sample-bank-statement.csv';
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Import Data</h1>
          <p className="text-slate-400">Upload your bank statement to generate personalized insights.</p>
        </div>

        <div
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`glass rounded-2xl p-10 text-center border-2 border-dashed transition-all duration-300 cursor-pointer mb-6 ${
            dragging ? 'border-brand-500/80 bg-brand-500/5 scale-[1.01]' : file ? 'border-brand-500/40 bg-brand-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/3'
          }`}
        >
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

          {file ? (
            <div className="space-y-3">
              <div className="w-14 h-14 bg-brand-500/15 border border-brand-500/30 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7 text-brand-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{file.name}</p>
                <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB · Ready to upload</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 mx-auto">
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <CloudUpload className="w-7 h-7 text-slate-400" />
              </div>
              <div>
                <p className="text-white font-medium">Drag & drop your CSV here</p>
                <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
              </div>
            </div>
          )}
        </div>

        {file && !result && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-3.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] shadow-lg shadow-brand-500/25 mb-6"
          >
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><CloudUpload className="w-4 h-4" /> Upload & Analyze</>}
          </button>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-xl mb-6">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="flex items-start gap-3 p-4 bg-brand-500/10 border border-brand-500/25 rounded-xl mb-6">
            <CheckCircle className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-brand-300">{result.message}</p>
              <p className="text-xs text-slate-400 mt-0.5">{result.count} transactions imported · Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Format Requirements</h3>
            </div>
            <p className="text-xs text-slate-400 mb-2">Your CSV must have these columns in order:</p>
            <code className="block text-xs bg-white/5 border border-white/5 rounded-lg p-2.5 text-brand-300 font-mono mb-2">
              Date, Description, Category, Amount, Type
            </code>
            <p className="text-xs text-slate-500">Type must be <span className="text-brand-400">income</span> or <span className="text-red-400">expense</span></p>
          </div>

          <div className="glass rounded-xl p-5 border border-white/5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Tools</h3>
            <button
              onClick={downloadSample}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 rounded-xl text-sm text-blue-300 transition-all duration-200"
            >
              <Download className="w-4 h-4" /> Download Sample CSV
            </button>
            <button
              onClick={handleClear}
              disabled={clearing}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 rounded-xl text-sm text-red-400 transition-all duration-200 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> {clearing ? 'Clearing...' : 'Clear All Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
