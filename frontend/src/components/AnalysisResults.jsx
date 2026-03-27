import React from 'react';
import { Award, TrendingUp, AlertTriangle, Check, RefreshCw, PieChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from 'recharts';

export default function AnalysisResults({ results, onReset }) {
  const { health_score, portfolio_metrics, ai_recommendations, risk_assessment, tax_saving_opportunities } = results;

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-emerald-100 text-emerald-700';
    if (score >= 50) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
      case 'medium': return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white';
      default: return 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white';
    }
  };

  const assetAllocationData = Object.entries(portfolio_metrics.asset_allocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value
  }));

  const COLORS = ['#0f766e', '#0284c7', '#06b6d4', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="bg-white/95 rounded-3xl shadow-2xl-purple p-8 sm:p-10 border border-slate-200/80 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-center mb-10">
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-2xl mr-4 border border-amber-200/70">
            <Award className="w-12 h-12 text-amber-700" />
          </div>
          <div className="text-center flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Money Health Score
            </h2>
            <p className="text-slate-500 text-sm mt-2">Your comprehensive financial wellness assessment</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <div className={`text-7xl sm:text-8xl font-bold mb-2 ${getScoreColor(health_score.overall_score)}`} style={{ fontFamily: 'var(--font-display)' }}>
            {health_score.overall_score}
            <span className="text-3xl sm:text-4xl text-slate-400">/100</span>
          </div>
          <div className={`inline-block px-8 py-3 rounded-full text-xl font-bold mt-4 ${getScoreBg(health_score.overall_score)} shadow-sm border border-black/5`}>
            Grade: {health_score.grade}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {health_score.dimensions.map((dim, idx) => (
            <div key={idx} className="p-6 bg-gradient-to-br from-slate-50 to-sky-50/60 rounded-2xl border-2 border-slate-200 transition-all hover:shadow-lg hover:border-sky-300">
              <h3 className="font-bold text-slate-800 mb-3 text-lg">{dim.dimension}</h3>
              <div className={`text-4xl font-bold mb-3 ${getScoreColor(dim.score)}`} style={{ fontFamily: 'var(--font-display)' }}>
                {dim.score.toFixed(0)}
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${getScoreBg(dim.score)}`}>
                {dim.status}
              </div>
              <ul className="space-y-2">
                {dim.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start">
                    <span className="text-teal-700 mr-2 font-bold">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/95 rounded-3xl shadow-2xl-purple p-8 border border-slate-200/80 backdrop-blur-xl">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-sky-100 to-cyan-100 p-3 rounded-xl mr-4 border border-sky-200/70">
              <TrendingUp className="w-8 h-8 text-sky-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
              Portfolio Metrics
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/70">
              <span className="font-semibold text-slate-700">Total Invested</span>
              <span className="text-xl font-bold text-slate-900">₹{portfolio_metrics.total_invested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl border border-sky-200/60">
              <span className="font-semibold text-slate-700">Current Value</span>
              <span className="text-xl font-bold text-sky-700">₹{portfolio_metrics.current_value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
              <span className="font-semibold text-slate-700">Absolute Returns</span>
              <span className={`text-xl font-bold ${portfolio_metrics.absolute_returns >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ₹{portfolio_metrics.absolute_returns.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200/50">
              <span className="font-semibold text-slate-700">Returns %</span>
              <span className={`text-xl font-bold ${portfolio_metrics.returns_percentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {portfolio_metrics.returns_percentage.toFixed(2)}%
              </span>
            </div>
            {portfolio_metrics.xirr && (
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-600 to-sky-600 rounded-xl border-2 border-sky-400/40 text-white">
                <span className="font-semibold">XIRR (Annualized)</span>
                <span className="text-xl font-bold">{portfolio_metrics.xirr.toFixed(2)}%</span>
              </div>
            )}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50">
              <span className="font-semibold text-slate-700">Diversification Score</span>
              <span className="text-xl font-bold text-slate-900">{portfolio_metrics.diversification_score.toFixed(0)}/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 rounded-3xl shadow-2xl-purple p-8 border border-slate-200/80 backdrop-blur-xl">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-xl mr-4 border border-emerald-200/70">
              <PieChart className="w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
              Asset Allocation
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <RPieChart>
              <Pie
                data={assetAllocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {assetAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </RPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/95 rounded-3xl shadow-2xl-purple p-8 sm:p-10 border border-slate-200/80 backdrop-blur-xl">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-xl mr-4 border border-emerald-200/70">
            <Check className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
            AI-Powered Recommendations
          </h2>
        </div>

        <div className="space-y-4">
          {ai_recommendations.map((rec, idx) => (
            <div key={idx} className="p-6 bg-gradient-to-r from-slate-50 to-sky-50 rounded-2xl border-2 border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-slate-800">{rec.title}</h3>
                <span className={`px-4 py-2 rounded-full text-xs font-bold text-white ${getPriorityColor(rec.priority)}`}>
                  {rec.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">{rec.description}</p>
              <div className="flex items-center text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 rounded-xl font-semibold shadow-lg">
                <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Impact: {rec.potential_impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/95 rounded-3xl shadow-2xl-purple p-8 sm:p-10 border border-slate-200/80 backdrop-blur-xl">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-br from-red-100 to-orange-100 p-3 rounded-xl mr-4 border border-red-200/70">
            <AlertTriangle className="w-8 h-8 text-red-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
            Risk Assessment
          </h2>
        </div>
        <p className="text-slate-700 text-lg leading-relaxed bg-red-50/50 p-6 rounded-xl border border-red-200/50">
          {risk_assessment}
        </p>
      </div>

      <div className="bg-white/95 rounded-3xl shadow-2xl-purple p-8 sm:p-10 border border-slate-200/80 backdrop-blur-xl">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-3 rounded-xl mr-4 border border-amber-200/70">
            <TrendingUp className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
            Tax Saving Opportunities
          </h2>
        </div>
        <ul className="space-y-3">
          {tax_saving_opportunities.map((opp, idx) => (
            <li key={idx} className="flex items-start p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200/60 hover:shadow-lg transition-all">
              <Check className="w-6 h-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0 font-bold" />
              <span className="text-slate-700 font-medium">{opp}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gradient-to-r from-teal-600 to-sky-600 text-white py-5 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-sky-700 transition-all transform hover:scale-[1.01] shadow-lg shadow-sky-900/20 active:scale-[0.99] flex items-center justify-center space-x-2"
      >
        <RefreshCw className="w-5 h-5" />
        <span>Analyze Another Profile</span>
      </button>
    </div>
  );
}
