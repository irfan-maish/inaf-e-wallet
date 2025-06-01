import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, 
  CreditCard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRightLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    balance, 
    cardBalance,
    transactions, 
    refreshBalance, 
    hasCard, 
    cardApplication,
    transferToCard,
    transferToAccount
  } = useWallet();

  const [transferAmount, setTransferAmount] = useState('');
  const [transferType, setTransferType] = useState<'toCard' | 'toAccount'>('toCard');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);

    if (isNaN(amount) || amount <= 0) {
      return setError('Please enter a valid amount');
    }

    try {
      setError('');
      setLoading(true);

      if (transferType === 'toCard') {
        if (amount > balance) {
          throw new Error('Insufficient account balance');
        }
        await transferToCard(amount);
      } else {
        if (amount > cardBalance) {
          throw new Error('Insufficient card balance');
        }
        await transferToAccount(amount);
      }

      setTransferAmount('');
      setShowTransferModal(false);
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-400" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-rose-400" />;
      default:
        return <Clock className="h-5 w-5 text-amber-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Account Balance Section */}
      <div className="lg:col-span-2">
        <div className="card-glassmorphism rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Account Balance</h2>
            <button 
              onClick={refreshBalance}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              title="Refresh Balance"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          
          <div className="bg-indigo-800/50 rounded-lg p-6 mb-6">
            <div className="text-white/70 mb-1">Available Balance</div>
            <div className="text-4xl font-bold text-white">{balance} Tk</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Link to="/deposit" className="btn btn-primary flex items-center justify-center">
              <ArrowDownCircle className="h-5 w-5 mr-2" />
              Deposit
            </Link>
            <Link to="/withdraw" className="btn btn-secondary flex items-center justify-center">
              <ArrowUpCircle className="h-5 w-5 mr-2" />
              Withdraw
            </Link>
          </div>
        </div>

        {/* Card Balance Section */}
        {hasCard && (
          <div className="card-glassmorphism rounded-xl p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Card Balance</h2>
              <Link 
                to="/my-card"
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                title="View Card"
              >
                <CreditCard className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="bg-emerald-800/50 rounded-lg p-6 mb-6">
              <div className="text-white/70 mb-1">Available Card Balance</div>
              <div className="text-4xl font-bold text-white">{cardBalance} Tk</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setTransferType('toCard');
                  setShowTransferModal(true);
                }}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
              >
                <ArrowRightLeft className="h-5 w-5 mr-2" />
                Add Money
              </button>
              <button
                onClick={() => {
                  setTransferType('toAccount');
                  setShowTransferModal(true);
                }}
                className="btn bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center"
              >
                <ArrowRightLeft className="h-5 w-5 mr-2" />
                Transfer Back
              </button>
            </div>
          </div>
        )}
        
        {!hasCard && !cardApplication && (
          <Link 
            to="/apply-card"
            className="mt-6 block w-full btn btn-accent flex items-center justify-center"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Apply for Virtual Card
          </Link>
        )}
        
        {cardApplication && cardApplication.status === 'pending' && (
          <div className="mt-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center">
            <Clock className="h-5 w-5 text-amber-400 mr-2" />
            <div>
              <p className="text-white font-medium">Your card application is being processed</p>
              <p className="text-white/70 text-sm">
                Applied on {formatDate(cardApplication.submitted_at)}
              </p>
            </div>
            <Link to="/my-email" className="ml-auto btn bg-amber-500/30 hover:bg-amber-500/50 text-white text-sm py-1">
              View Details
            </Link>
          </div>
        )}
      </div>
      
      {/* User Info Section */}
      <div className="card-glassmorphism rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Account Info</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-white/70 text-sm">Email</p>
            <p className="text-white font-medium">{currentUser?.email}</p>
          </div>
          
          <div>
            <p className="text-white/70 text-sm">Account Status</p>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
              <p className="text-white font-medium">Verified</p>
            </div>
          </div>
          
          <div>
            <p className="text-white/70 text-sm">Card Status</p>
            <div className="flex items-center">
              {hasCard ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                  <p className="text-white font-medium">Active</p>
                </>
              ) : (
                <>
                  {cardApplication ? (
                    <>
                      <Clock className="h-4 w-4 text-amber-400 mr-2" />
                      <p className="text-white font-medium">Pending</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-white/50 mr-2" />
                      <p className="text-white/70 font-medium">Not Applied</p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Transactions Section */}
      <div className="lg:col-span-3">
        <div className="card-glassmorphism rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              No transactions yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Method</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction.id} className="border-b border-white/10">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {transaction.type === 'deposit' ? (
                            <ArrowDownCircle className="h-5 w-5 text-emerald-400 mr-2" />
                          ) : transaction.type === 'withdraw' ? (
                            <ArrowUpCircle className="h-5 w-5 text-rose-400 mr-2" />
                          ) : (
                            <ArrowRightLeft className="h-5 w-5 text-amber-400 mr-2" />
                          )}
                          <span className="text-white capitalize">
                            {transaction.type === 'card-transfer' ? 'Card Transfer' : transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          transaction.type === 'deposit' || 
                          (transaction.type === 'card-transfer' && transaction.amount < 0)
                            ? 'text-emerald-400' 
                            : 'text-rose-400'
                        }`}>
                          {transaction.type === 'deposit' || 
                           (transaction.type === 'card-transfer' && transaction.amount < 0)
                            ? '+' 
                            : '-'}
                          {Math.abs(transaction.amount)} Tk
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {transaction.method}
                      </td>
                      <td className="py-3 px-4 text-white/70">
                        {formatDate(transaction.timestamp)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className="ml-2 text-white capitalize">
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-indigo-900/90 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              {transferType === 'toCard' ? 'Add Money to Card' : 'Transfer to Account'}
            </h3>
            
            {error && (
              <div className="bg-rose-500/20 border border-rose-500/50 text-white p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="form-group">
                <label htmlFor="amount" className="text-white mb-1 block">Amount (Taka)</label>
                <input
                  id="amount"
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter amount"
                  min="1"
                  max={transferType === 'toCard' ? balance : cardBalance}
                  required
                />
                <p className="text-white/70 text-sm mt-1">
                  Available: {transferType === 'toCard' ? balance : cardBalance} Tk
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferModal(false);
                    setError('');
                    setTransferAmount('');
                  }}
                  className="btn bg-white/10 hover:bg-white/20 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Processing...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;