import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

const ApplyCardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { applyForCard, cardApplication } = useWallet();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [steps, setSteps] = useState({ current: 1, total: 2 });

  useEffect(() => {
    // Redirect if already has a pending or verified card
    if (cardApplication) {
      navigate('/my-email');
    }
  }, [cardApplication, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (steps.current < steps.total) {
      setSteps(prev => ({ ...prev, current: prev.current + 1 }));
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await applyForCard({
        name,
        dob,
        phone,
        email
      });
      
      navigate('/my-email');
    } catch (err) {
      setError('Failed to apply for card');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevStep = () => {
    if (steps.current > 1) {
      setSteps(prev => ({ ...prev, current: prev.current - 1 }));
    }
  };

  // Calculate max date (18 years ago)
  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card-glassmorphism rounded-xl p-6">
        <Link to="/dashboard" className="flex items-center text-indigo-200 mb-6 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          <CreditCard className="h-6 w-6 mr-2" />
          Apply for Virtual Card
        </h1>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-white/70 text-sm">
              Step {steps.current} of {steps.total}
            </span>
            <span className="text-white/70 text-sm">
              {Math.round((steps.current / steps.total) * 100)}% Complete
            </span>
          </div>
          <div className="bg-white/10 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(steps.current / steps.total) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {error && (
          <div className="bg-rose-500/20 border border-rose-500/50 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {steps.current === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="name\" className="text-white mb-1 block">Full Name (as it will appear on card)</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dob" className="text-white mb-1 block">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="input-field w-full"
                  max={getMaxDate()}
                  required
                />
                <p className="text-white/60 text-xs mt-1">You must be at least 18 years old</p>
              </div>
            </>
          )}
          
          {steps.current === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="phone" className="text-white mb-1 block">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="text-white mb-1 block">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-medium text-white mb-2">Card Application Terms:</h3>
                <ul className="text-white/80 text-sm space-y-2 list-disc pl-4">
                  <li>Your virtual card will be issued after verification</li>
                  <li>The virtual card can be used for online purchases</li>
                  <li>There are no monthly fees for maintaining the card</li>
                  <li>By applying, you agree to our terms and conditions</li>
                </ul>
              </div>
            </>
          )}
          
          <div className="flex justify-between pt-2">
            {steps.current > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn bg-white/10 hover:bg-white/20 text-white"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  {steps.current < steps.total ? 'Next' : 'Submit Application'}
                  {steps.current < steps.total && <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />}
                  {steps.current === steps.total && <Check className="h-4 w-4 ml-2" />}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyCardPage;