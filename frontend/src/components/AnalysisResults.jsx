import React from 'react';
import { Award, TrendingUp, AlertTriangle, Check, RefreshCw, PieChart } from 'lucide-react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from 'recharts';

export default function AnalysisResults({ results, onReset }) {
  const { health_score, portfolio_metrics, ai_recommendations, risk_assessment, tax_saving_opportunities } = results;

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const assetAllocationData = Object.entries(portfolio_metrics.asset_allocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value
  }));

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-center mb-8">
          <Award className="w-12 h-12 text-purple-600 mr-4" />
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">Money Health Score</h2>
            <div className={`text-7xl font-bold mt-4 ${getScoreColor(health_score.overall_score)}`}>
              {health_score.overall_score}
              <span className="text-4xl">/100</span>
            </div>
            <div className={`inline-block px-6 py-2 rounded-full text-2xl font-bold mt-4 ${getScoreBg(health_score.overall_score)}`}>
              Grade: {health_score.grade}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {health_score.dimensions.map((dim, idx) => (
            <div key={idx} className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
              <h3 className="font-bold text-gray-800 mb-2">{dim.dimension}</h3>
              <div className={`text-3xl font-bold ${getScoreColor(dim.score)}`}>
                {dim.score.toFixed(0)}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${getScoreBg(dim.score)}`}>
                {dim.status}
              </div>
              <ul className="mt-3 space-y-1">
                {dim.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Portfolio Metrics</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700">Total Invested</span>
              <span className="text-xl font-bold text-gray-900">₹{portfolio_metrics.total_invested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700">Current Value</span>
              <span className="text-xl font-bold text-purple-600">₹{portfolio_metrics.current_value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700">Absolute Returns</span>
              <span className={`text-xl font-bold ${portfolio_metrics.absolute_returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{portfolio_metrics.absolute_returns.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700">Returns %</span>
              <span className={`text-xl font-bold ${portfolio_metrics.returns_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolio_metrics.returns_percentage.toFixed(2)}%
              </span>
            </div>
            {portfolio_metrics.xirr && (
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                <span className="font-semibold text-gray-700">XIRR (Annualized)</span>
                <span className="text-xl font-bold text-purple-600">{portfolio_metrics.xirr.toFixed(2)}%</span>
              </div>
            )}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700">Diversification Score</span>
              <span className="text-xl font-bold text-gray-900">{portfolio_metrics.diversification_score.toFixed(0)}/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center mb-6">
            <PieChart className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Asset Allocation</h2>
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

      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center mb-6">
          <Check className="w-8 h-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">AI-Powered Recommendations</h2>
        </div>

        <div className="space-y-4">
          {ai_recommendations.map((rec, idx) => (
            <div key={idx} className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-800">{rec.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(rec.priority)}`}>
                  {rec.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{rec.description}</p>
              <div className="flex items-center text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-semibold">Impact: {rec.potential_impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-8 h-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Risk Assessment</h2>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">{risk_assessment}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Tax Saving Opportunities</h2>
        </div>
        <ul className="space-y-3">
          {tax_saving_opportunities.map((opp, idx) => (
            <li key={idx} className="flex items-start p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <Check className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{opp}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Analyze Another Profile
      </button>
    </div>
  );
}
