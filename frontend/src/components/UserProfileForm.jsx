import React, { useState } from 'react';
import { User, DollarSign, CreditCard, Shield } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex items-center mb-6">
        <User className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Your Financial Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="100"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Income (₹)
            </label>
            <input
              type="number"
              name="monthly_income"
              value={formData.monthly_income}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Expenses (₹)
            </label>
            <input
              type="number"
              name="monthly_expenses"
              value={formData.monthly_expenses}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Savings/Investments (₹)
            </label>
            <input
              type="number"
              name="total_savings"
              value={formData.total_savings}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Debt (₹)
            </label>
            <input
              type="number"
              name="total_debt"
              value={formData.total_debt}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Emergency Fund (₹)
            </label>
            <input
              type="number"
              name="emergency_fund"
              value={formData.emergency_fund}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Life Insurance Cover (₹)
            </label>
            <input
              type="number"
              name="life_insurance_cover"
              value={formData.life_insurance_cover}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Health Insurance Cover (₹)
            </label>
            <input
              type="number"
              name="health_insurance_cover"
              value={formData.health_insurance_cover}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Dependents
            </label>
            <input
              type="number"
              name="dependents"
              value={formData.dependents}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Risk Profile
            </label>
            <select
              name="risk_profile"
              value={formData.risk_profile}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="has_home"
            checked={formData.has_home}
            onChange={handleChange}
            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
          />
          <label className="ml-3 text-sm font-medium text-gray-700">
            I own a home
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
        >
          Continue to Portfolio →
        </button>
      </form>
    </div>
  );
}
