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
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Your Investment Portfolio</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {holdings.map((holding, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200 relative">
            {holdings.length > 1 && (
              <button
                type="button"
                onClick={() => removeHolding(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <h3 className="text-lg font-bold text-gray-700 mb-4">Holding {index + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Scheme Name
                </label>
                <input
                  type="text"
                  value={holding.scheme_name}
                  onChange={(e) => updateHolding(index, 'scheme_name', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asset Class
                </label>
                <select
                  value={holding.asset_class}
                  onChange={(e) => updateHolding(index, 'asset_class', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Units
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={holding.units}
                  onChange={(e) => updateHolding(index, 'units', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Invested Amount (₹)
                </label>
                <input
                  type="number"
                  value={holding.invested_amount}
                  onChange={(e) => updateHolding(index, 'invested_amount', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Value (₹)
                </label>
                <input
                  type="number"
                  value={holding.current_value}
                  onChange={(e) => updateHolding(index, 'current_value', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={holding.purchase_date}
                  onChange={(e) => updateHolding(index, 'purchase_date', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addHolding}
          className="w-full py-3 border-2 border-dashed border-purple-400 rounded-lg text-purple-600 font-semibold hover:bg-purple-50 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Holding
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze My Financial Health →'}
        </button>
      </form>
    </div>
  );
}
