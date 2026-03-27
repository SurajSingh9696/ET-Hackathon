import React, { useState } from 'react';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';

export default function PortfolioForm({ onSubmit, loading }) {
  const [holdings, setHoldings] = useState([
    {
      scheme_name: 'HDFC Equity Fund',
      units: 100,
      current_value: 150000,
      invested_amount: 100000,
      asset_class: 'equity',
      purchase_date: '2023-01-15'
    }
  ]);

  const addHolding = () => {
    setHoldings([...holdings, {
      scheme_name: '',
      units: 0,
      current_value: 0,
      invested_amount: 0,
      asset_class: 'equity',
      purchase_date: new Date().toISOString().split('T')[0]
    }]);
  };

  const removeHolding = (index) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const updateHolding = (index, field, value) => {
    const updated = [...holdings];
    updated[index] = {
      ...updated[index],
      [field]: field === 'scheme_name' || field === 'asset_class' || field === 'purchase_date'
        ? value
        : parseFloat(value) || 0
    };
    setHoldings(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(holdings);
  };

  return (
    <div className="bg-white/95 rounded-3xl shadow-2xl-purple p-8 sm:p-10 border border-slate-200/80 backdrop-blur-xl">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-br from-teal-100 to-sky-100 p-3 rounded-xl mr-4 border border-teal-200/70">
          <TrendingUp className="w-8 h-8 text-teal-700" />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
            Your Investment Portfolio
          </h2>
          <p className="text-slate-500 text-sm mt-1">Add your holdings for a comprehensive portfolio analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {holdings.map((holding, index) => (
          <div key={index} className="p-7 bg-gradient-to-br from-slate-50 to-sky-50/60 rounded-2xl border-2 border-slate-200 relative transition-all hover:shadow-lg hover:border-sky-300">
            {holdings.length > 1 && (
              <button
                type="button"
                onClick={() => removeHolding(index)}
                className="absolute top-4 right-4 text-orange-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <h3 className="text-xl font-bold text-slate-800 mb-5" style={{ fontFamily: 'var(--font-display)' }}>
              Holding {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Scheme Name
                </label>
                <input
                  type="text"
                  value={holding.scheme_name}
                  onChange={(e) => updateHolding(index, 'scheme_name', e.target.value)}
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-white/90 text-slate-800"
                  placeholder="e.g., HDFC Equity Fund"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Asset Class
                </label>
                <select
                  value={holding.asset_class}
                  onChange={(e) => updateHolding(index, 'asset_class', e.target.value)}
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-white/90 text-slate-800"
                  required
                >
                  <option value="equity">Equity</option>
                  <option value="debt">Debt</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="gold">Gold</option>
                  <option value="liquid">Liquid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Units
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={holding.units}
                  onChange={(e) => updateHolding(index, 'units', e.target.value)}
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-white/90 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Invested Amount (₹)
                </label>
                <input
                  type="number"
                  value={holding.invested_amount}
                  onChange={(e) => updateHolding(index, 'invested_amount', e.target.value)}
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-white/90 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Current Value (₹)
                </label>
                <input
                  type="number"
                  value={holding.current_value}
                  onChange={(e) => updateHolding(index, 'current_value', e.target.value)}
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-white/90 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={holding.purchase_date}
                  onChange={(e) => updateHolding(index, 'purchase_date', e.target.value)}
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-white/90 text-slate-800"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addHolding}
          className="w-full py-4 border-2 border-dashed border-sky-400 rounded-xl text-sky-700 font-bold hover:bg-sky-50/70 transition-all flex items-center justify-center hover:border-sky-600 space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Another Holding</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-600 to-sky-600 text-white py-5 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-sky-700 transition-all transform hover:scale-[1.01] shadow-lg shadow-sky-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {loading ? 'Analyzing...' : 'Analyze My Financial Health →'}
        </button>
      </form>
    </div>
  );
}
