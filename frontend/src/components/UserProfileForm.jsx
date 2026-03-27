import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function UserProfileForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: 30,
    monthly_income: 100000,
    monthly_expenses: 60000,
    total_savings: 500000,
    total_debt: 200000,
    emergency_fund: 200000,
    life_insurance_cover: 5000000,
    health_insurance_cover: 500000,
    dependents: 2,
    risk_profile: 'moderate',
    has_home: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white/95 rounded-3xl shadow-2xl-purple p-8 sm:p-10 border border-slate-200/80 backdrop-blur-xl">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-br from-teal-100 to-sky-100 p-3 rounded-xl mr-4 border border-teal-200/70">
          <User className="w-8 h-8 text-teal-700" />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
            Your Financial Profile
          </h2>
          <p className="text-slate-500 text-sm mt-1">Enter your financial information for personalized analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="100"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Monthly Income (₹)
            </label>
            <input
              type="number"
              name="monthly_income"
              value={formData.monthly_income}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Monthly Expenses (₹)
            </label>
            <input
              type="number"
              name="monthly_expenses"
              value={formData.monthly_expenses}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Total Savings/Investments (₹)
            </label>
            <input
              type="number"
              name="total_savings"
              value={formData.total_savings}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Total Debt (₹)
            </label>
            <input
              type="number"
              name="total_debt"
              value={formData.total_debt}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Emergency Fund (₹)
            </label>
            <input
              type="number"
              name="emergency_fund"
              value={formData.emergency_fund}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Life Insurance Cover (₹)
            </label>
            <input
              type="number"
              name="life_insurance_cover"
              value={formData.life_insurance_cover}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Health Insurance Cover (₹)
            </label>
            <input
              type="number"
              name="health_insurance_cover"
              value={formData.health_insurance_cover}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Number of Dependents
            </label>
            <input
              type="number"
              name="dependents"
              value={formData.dependents}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Risk Profile
            </label>
            <select
              name="risk_profile"
              value={formData.risk_profile}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 transition-smooth bg-slate-50/70 text-slate-800"
              required
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-sky-50 p-5 rounded-2xl border-2 border-teal-200 flex items-center space-x-4">
          <input
            type="checkbox"
            name="has_home"
            checked={formData.has_home}
            onChange={handleChange}
            className="w-6 h-6 text-teal-700 rounded-lg cursor-pointer"
          />
          <label className="text-base font-medium text-gray-700 cursor-pointer flex-1">
            I own a home
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-600 to-sky-600 text-white py-5 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-sky-700 transition-all transform hover:scale-[1.01] shadow-lg shadow-sky-900/20 active:scale-[0.99]"
        >
          Continue to Portfolio →
        </button>
      </form>
    </div>
  );
}
