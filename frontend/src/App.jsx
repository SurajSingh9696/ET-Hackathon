import React, { useState } from 'react';
import { Wallet, AlertCircle, CheckCircle, Sparkles, Zap } from 'lucide-react';
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
    <div className="min-h-screen py-8 px-4 relative app-shell">
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-md border border-red-400/20">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-200">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-sky-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-sky-600 border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-sky-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>Analyzing Your Finances</h3>
              <p className="text-slate-600 mb-4">Our AI is crunching the numbers...</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-600 to-cyan-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-500">{analysisProgress}% Complete</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs tracking-[0.2em] uppercase font-semibold">
            Intelligent Wealth Planning
          </div>
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/15 glass-effect p-4 rounded-2xl mr-4 animate-float">
              <Wallet className="w-14 h-14 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              AI Money Mentor
            </h1>
            <Zap className="w-10 h-10 text-amber-300 ml-3 animate-pulse" />
          </div>
          <p className="text-lg sm:text-xl text-white/95 mb-2 font-light">
            Your Personal Financial Health Analyzer
          </p>
          <p className="text-sm text-white/80 mb-6">
            Powered by advanced AI for comprehensive wealth insights
          </p>
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 text-white/90 text-sm">
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-teal-300" />
              <span className="font-medium">2-Minute Analysis</span>
            </div>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-teal-300" />
              <span className="font-medium">100% Free</span>
            </div>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-teal-300" />
              <span className="font-medium">No Signup</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2">
            <StepIndicator
              number={1}
              title="Profile"
              active={step === 1}
              completed={step > 1}
            />
            <div className={`w-12 h-1 rounded-full transition-all duration-500 ${step > 1 ? 'bg-gradient-to-r from-teal-400 to-cyan-400' : 'bg-white/30'}`}></div>
            <StepIndicator
              number={2}
              title="Portfolio"
              active={step === 2}
              completed={step > 2}
            />
            <div className={`w-12 h-1 rounded-full transition-all duration-500 ${step > 2 ? 'bg-gradient-to-r from-teal-400 to-cyan-400' : 'bg-white/30'}`}></div>
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
                <Sparkles className="w-4 h-4 mr-2 text-amber-200" />
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
    <div className="flex items-center transition-all duration-300 flex-col">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
        completed ? 'bg-teal-400 shadow-lg shadow-teal-400/40 scale-110 animate-scale-in text-slate-900' :
        active ? 'bg-white text-slate-800 shadow-lg shadow-white/70 scale-110 animate-pulse-slow' :
        'bg-white/25 text-white scale-95'
      }`}>
        {completed ? <CheckCircle className="w-6 h-6" /> : number}
      </div>
      <span className={`mt-2 font-semibold text-xs transition-all text-center ${
        active ? 'text-white font-bold' : completed ? 'text-teal-300' : 'text-white/70'
      }`}>
        {title}
      </span>
    </div>
  );
}

export default App;
