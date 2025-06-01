import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WithdrawPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bKash');
  const [accountDetails, setAccountDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { withdraw, balance } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseFloat(amount) <= 0) {
      return setError('Amount must be greater than 0');
    }
    
    if (parseFloat(amount) > balance) {
      return setError('Insufficient balance');
    }
    
    try {
      setError('');
      setLoading(true);
      await withdraw(parseFloat(amount), method, accountDetails);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to process withdrawal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card-glassmorphism rounded-xl p-6">
        <Link to="/dashboard" className="flex items-center text-indigo-200 mb-6 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Download className="h-6 w-6 mr-2" />
          Withdraw Funds
        </h1>
        
        <div className="bg-indigo-800/40 p-4 rounded-lg mb-6 flex items-center">
          <span className="text-white/80 mr-2">Available Balance:</span>
          <span className="text-white font-bold">{balance} Tk</span>
        </div>
        
        {error && (
          <div className="bg-rose-500/20 border border-rose-500/50 text-white p-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="amount" className="text-white mb-1 block">Amount (Taka)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field w-full"
              placeholder="Enter amount"
              min="1"
              max={balance}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="text-white mb-3 block">Select Withdrawal Method</label>
            <div className="grid grid-cols-3 gap-4">
              <div 
                className={`p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                  method === 'bKash' 
                    ? 'bg-pink-600/40 border-2 border-pink-500' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
                onClick={() => setMethod('bKash')}
              >
                <Smartphone className={`h-6 w-6 ${method === 'bKash' ? 'text-pink-300' : 'text-white/70'} mb-2`} />
                <span className={`text-sm font-medium ${method === 'bKash' ? 'text-white' : 'text-white/70'}`}>
                  bKash
                </span>
              </div>
              
              <div 
                className={`p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                  method === 'Nagad' 
                    ? 'bg-orange-600/40 border-2 border-orange-500' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
                onClick={() => setMethod('Nagad')}
              >
                <Smartphone className={`h-6 w-6 ${method === 'Nagad' ? 'text-orange-300' : 'text-white/70'} mb-2`} />
                <span className={`text-sm font-medium ${method === 'Nagad' ? 'text-white' : 'text-white/70'}`}>
                  Nagad
                </span>
              </div>
              
              <div 
                className={`p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                  method === 'Bank' 
                    ? 'bg-blue-600/40 border-2 border-blue-500' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
                onClick={() => setMethod('Bank')}
              >
                <CreditCard className={`h-6 w-6 ${method === 'Bank' ? 'text-blue-300' : 'text-white/70'} mb-2`} />
                <span className={`text-sm font-medium ${method === 'Bank' ? 'text-white' : 'text-white/70'}`}>
                  Bank
                </span>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="accountDetails" className="text-white mb-1 block">
              {method === 'Bank' ? 'Bank Account Details' : `${method} Number`}
            </label>
            <input
              id="accountDetails"
              type="text"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              className="input-field w-full"
              placeholder={method === 'Bank' 
                ? 'Enter account number, bank name, branch' 
                : `Enter ${method} number`
              }
              required
            />
          </div>
          
          <div className="bg-amber-500/20 border border-amber-500/30 p-4 rounded-lg mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-white mb-1">Important Information:</h3>
                <p className="text-white/80 text-sm">
                  Withdrawal requests are typically processed within 24 hours. 
                  A small processing fee may apply depending on the withdrawal method.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center"
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
                <span>Confirm Withdrawal</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawPage;