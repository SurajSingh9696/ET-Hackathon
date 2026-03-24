import React, { useState } from 'react';
import { Wallet, TrendingUp, Shield, Target, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
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

  const handleProfileSubmit = (profile) => {
    setUserProfile(profile);
    setStep(2);
  };

  const handlePortfolioSubmit = async (portfolioHoldings) => {
    setHoldings(portfolioHoldings);
    setLoading(true);

    try {
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_profile: userProfile,
          holdings: portfolioHoldings
        })
      });

      const data = await response.json();
      setAnalysisResults(data);
      setStep(3);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setStep(1);
    setUserProfile(null);
    setHoldings([]);
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-12 h-12 text-white mr-3" />
            <h1 className="text-5xl font-bold text-white">AI Money Mentor</h1>
          </div>
          <p className="text-xl text-white/90">
            Your Personal Financial Health Analyzer powered by AI
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <StepIndicator
              number={1}
              title="Profile"
              active={step === 1}
              completed={step > 1}
            />
            <ArrowRight className="text-white/50" />
            <StepIndicator
              number={2}
              title="Portfolio"
              active={step === 2}
              completed={step > 2}
            />
            <ArrowRight className="text-white/50" />
            <StepIndicator
              number={3}
              title="Analysis"
              active={step === 3}
              completed={false}
            />
          </div>
        </div>

        {step === 1 && <UserProfileForm onSubmit={handleProfileSubmit} />}
        {step === 2 && <PortfolioForm onSubmit={handlePortfolioSubmit} loading={loading} />}
        {step === 3 && analysisResults && (
          <AnalysisResults results={analysisResults} onReset={resetAnalysis} />
        )}
      </div>
    </div>
  );
}

function StepIndicator({ number, title, active, completed }) {
  return (
    <div className="flex items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
        completed ? 'bg-green-500 text-white' :
        active ? 'bg-white text-purple-700' :
        'bg-white/30 text-white'
      }`}>
        {completed ? <CheckCircle className="w-6 h-6" /> : number}
      </div>
      <span className={`ml-2 font-medium ${active ? 'text-white' : 'text-white/70'}`}>
        {title}
      </span>
    </div>
  );
}

export default App;
