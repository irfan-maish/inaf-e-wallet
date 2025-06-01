import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CreditCard, Smartphone } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const DepositPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bKash');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { deposit } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseFloat(amount) <= 0) {
      return setError('Amount must be greater than 0');
    }
    
    try {
      setError('');
      setLoading(true);
      await deposit(parseFloat(amount), method, reference);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to process deposit');
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
          <Upload className="h-6 w-6 mr-2" />
          Deposit Funds
        </h1>
        
        {error && (
          <div className="bg-rose-500/20 border border-rose-500/50 text-white p-3 rounded-md mb-4">
            {error}
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
              required
            />
          </div>
          
          <div className="form-group">
            <label className="text-white mb-3 block">Select Payment Method</label>
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
            <label htmlFor="reference" className="text-white mb-1 block">
              Reference / Transaction ID
            </label>
            <input
              id="reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="input-field w-full"
              placeholder={`Enter ${method} transaction ID`}
              required
            />
          </div>
          
          <div className="bg-indigo-800/30 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-white mb-2">Payment Instructions:</h3>
            {method === 'bKash' && (
              <ol className="text-white/80 text-sm space-y-1 list-decimal pl-4">
                <li>Send the amount to bKash number: 01716163840</li>
                <li>Use "Send Money" option</li>
                <li>Keep the Transaction ID from your bKash message</li>
                <li>Enter the Transaction ID in the reference field above</li>
              </ol>
            )}
            
            {method === 'Nagad' && (
              <ol className="text-white/80 text-sm space-y-1 list-decimal pl-4">
                <li>Send the amount to Nagad number: 01716163840</li>
                <li>Use "Send Money" option</li>
                <li>Keep the Transaction ID from your Nagad message</li>
                <li>Enter the Transaction ID in the reference field above</li>
              </ol>
            )}
            
            {method === 'Bank' && (
              <ol className="text-white/80 text-sm space-y-1 list-decimal pl-4">
                <li>Transfer the amount to Account Number: 01716163840</li>
                <li>Bank Name: Example Bank</li>
                <li>Branch: Main Branch</li>
                <li>Enter your bank reference number above</li>
              </ol>
            )}
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
                <span>Confirm Deposit</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositPage;