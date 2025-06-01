import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const MyEmailPage: React.FC = () => {
  const { cardApplication, verifyCardApplication, hasCard } = useWallet();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!cardApplication || cardApplication.status === 'verified') return;
    
    // Set initial timer (2 minutes from application submission)
    const submittedAt = new Date(cardApplication.submitted_at).getTime();
    const verificationTime = submittedAt + 2 * 60 * 1000; // 2 minutes in milliseconds
    const now = new Date().getTime();
    const initialTimeRemaining = Math.max(0, Math.floor((verificationTime - now) / 1000));
    
    setTimeRemaining(initialTimeRemaining);
    
    // Auto-verification timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          if (cardApplication && cardApplication.status === 'pending') {
            handleVerification();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [cardApplication]);

  const handleVerification = async () => {
    if (!cardApplication || hasCard) return;
    
    try {
      setVerifying(true);
      await verifyCardApplication();
    } catch (error) {
      console.error('Error verifying card:', error);
    } finally {
      setVerifying(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!cardApplication) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card-glassmorphism rounded-xl p-6">
          <Link to="/dashboard\" className="flex items-center text-indigo-200 mb-6 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-2xl font-bold text-white mb-6">My Email</h1>
          
          <div className="text-center py-12">
            <div className="text-white/70 mb-4">
              You haven't applied for a virtual card yet.
            </div>
            <Link to="/apply-card" className="btn btn-primary inline-flex items-center">
              Apply for Virtual Card
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card-glassmorphism rounded-xl p-6">
        <Link to="/dashboard" className="flex items-center text-indigo-200 mb-6 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-6">My Email</h1>
        
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Virtual Card Application</h2>
              <p className="text-white/70">
                Submitted on {formatDate(cardApplication.submitted_at)}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full flex items-center ${
              cardApplication.status === 'verified' 
                ? 'bg-emerald-500/20 text-emerald-300' 
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {cardApplication.status === 'verified' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Pending</span>
                </>
              )}
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <h3 className="font-medium text-white mb-3">Application Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white/70 text-sm">Full Name</p>
                <p className="text-white">{cardApplication.name}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Date of Birth</p>
                <p className="text-white">{new Date(cardApplication.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Phone Number</p>
                <p className="text-white">{cardApplication.phone}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Email Address</p>
                <p className="text-white">{cardApplication.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        {cardApplication.status === 'pending' && (
          <div className="bg-indigo-800/30 p-6 rounded-lg mb-6">
            <h3 className="font-medium text-white mb-3">Verification Status</h3>
            
            {timeRemaining !== null && timeRemaining > 0 ? (
              <>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Verifying your application...</span>
                    <span className="text-white font-medium">{formatTime(timeRemaining)}</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${100 - (timeRemaining / 120) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-white/70 text-sm">
                  Your application is being processed. The card will be automatically issued
                  once verification is complete.
                </p>
              </>
            ) : (
              <div className="text-center py-2">
                <button
                  onClick={handleVerification}
                  disabled={verifying}
                  className="btn btn-primary flex items-center justify-center mx-auto"
                >
                  {verifying ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                        <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Verification
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
        
        {cardApplication.status === 'verified' && (
          <div className="text-center">
            <p className="text-white mb-4">
              Your virtual card is ready! Click below to view your card details.
            </p>
            <Link to="/my-card" className="btn btn-primary inline-flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              View My Virtual Card
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEmailPage;