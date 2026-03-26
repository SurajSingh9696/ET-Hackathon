import React, { useState } from 'react';
import { Wallet, TrendingUp, Shield, Target, AlertCircle, CheckCircle, ArrowRight, Sparkles, Zap } from 'lucide-react';
import UserProfileForm from './components/UserProfileForm';
import PortfolioForm from './components/PortfolioForm';
import AnalysisResults from './components/AnalysisResults';
import './index.css';

function App() {
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleProfileSubmit = (profile) => {
    setUserProfile(profile);
    setStep(2);
  };

  const handlePortfolioSubmit = async (portfolioHoldings) => {
    setHoldings(portfolioHoldings);
    setLoading(true);
    setError(null);
    setAnalysisProgress(0);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_profile: userProfile,
          holdings: portfolioHoldings
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisProgress(100);

      setTimeout(() => {
        setAnalysisResults(data);
        setStep(3);
        clearInterval(progressInterval);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Analysis failed:', error);
      setError('Unable to complete analysis. Please check your connection and try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setAnalysisProgress(0);
      }, 600);
    }
  };

  const resetAnalysis = () => {
    setStep(1);
    setUserProfile(null);
    setHoldings([]);
    setAnalysisResults(null);
    setError(null);
  };

  const loadDemoData = () => {
    const demoProfile = {
      age: 32,
      monthly_income: 120000,
      monthly_expenses: 70000,
      total_savings: 800000,
      total_debt: 150000,
      emergency_fund: 250000,
      life_insurance_cover: 10000000,
      health_insurance_cover: 1000000,
      dependents: 2,
      risk_profile: 'moderate',
      has_home: false
    };
    setUserProfile(demoProfile);
    setStep(2);
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 max-w-md">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Finances</h3>
              <p className="text-gray-600 mb-4">Our AI is crunching the numbers...</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{analysisProgress}% Complete</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl mr-4">
              <Wallet className="w-12 h-12 text-white animate-float" />
            </div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">AI Money Mentor</h1>
            <Zap className="w-8 h-8 text-yellow-300 ml-3 animate-pulse" />
          </div>
          <p className="text-xl text-white/90 mb-4">
            Your Personal Financial Health Analyzer powered by AI
          </p>
          <div className="flex items-center justify-center space-x-4 text-white/80 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-300" />
              <span>2-Minute Analysis</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-300" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-300" />
              <span>No Signup</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <StepIndicator
              number={1}
              title="Profile"
              active={step === 1}
              completed={step > 1}
            />
            <ArrowRight className={`text-white/50 transition-all ${step > 1 ? 'animate-pulse-slow' : ''}`} />
            <StepIndicator
              number={2}
              title="Portfolio"
              active={step === 2}
              completed={step > 2}
            />
            <ArrowRight className={`text-white/50 transition-all ${step > 2 ? 'animate-pulse-slow' : ''}`} />
            <StepIndicator
              number={3}
              title="Analysis"
              active={step === 3}
              completed={false}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="animate-slide-up">
            <UserProfileForm onSubmit={handleProfileSubmit}  />
            <div className="text-center mt-6">
              <button
                onClick={loadDemoData}
                className="text-white/80 hover:text-white underline decoration-dotted flex items-center justify-center mx-auto transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try with Demo Data
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="animate-slide-up">
            <PortfolioForm onSubmit={handlePortfolioSubmit} loading={loading} />
          </div>
        )}
        {step === 3 && analysisResults && (
          <div className="animate-fade-in">
            <AnalysisResults results={analysisResults} onReset={resetAnalysis} />
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({ number, title, active, completed }) {
  return (
    <div className="flex items-center transition-all duration-300">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
        completed ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-110' :
        active ? 'bg-white text-purple-700 shadow-lg shadow-white/50 scale-110 animate-pulse-slow' :
        'bg-white/30 text-white scale-100'
      }`}>
        {completed ? <CheckCircle className="w-6 h-6" /> : number}
      </div>
      <span className={`ml-2 font-medium transition-all ${
        active ? 'text-white font-bold' : 'text-white/70'
      }`}>
        {title}
      </span>
    </div>
  );
}

export default App;
