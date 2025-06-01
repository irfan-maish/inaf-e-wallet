import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Copy, CheckCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const MyCardPage: React.FC = () => {
  const { cardApplication } = useWallet();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!cardApplication || cardApplication.status !== 'verified') {
    return (
      <div className="max-w-xl mx-auto animate-fade-in">
        <div className="card-glassmorphism rounded-xl p-6">
          <Link to="/dashboard" className="flex items-center text-indigo-200 mb-6 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
            <CreditCard className="h-6 w-6 mr-2" />
            My Virtual Card
          </h1>
          
          <div className="text-center py-12">
            <div className="text-white/70 mb-4">
              You don't have a virtual card yet.
            </div>
            <Link to="/apply-card" className="btn btn-primary">
              Apply for Virtual Card
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyCardNumber = () => {
    if (!cardApplication.card_number) return;
    
    navigator.clipboard.writeText(cardApplication.card_number.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="card-glassmorphism rounded-xl p-6">
        <Link to="/dashboard" className="flex items-center text-indigo-200 mb-6 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          <CreditCard className="h-6 w-6 mr-2" />
          My Virtual Card
        </h1>
        
        <div className="mb-6">
          <p className="text-white/70 text-center mb-3">
            Click on the card to view the card details
          </p>
          
          {/* Card Flip Container */}
          <div 
            className={`card-flip mx-auto mb-6 ${isFlipped ? 'flipped' : ''}`}
            style={{ maxWidth: '340px' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="card-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div className="w-full h-56 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-2xl p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white font-bold">INAF Card</div>
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-lg text-white font-medium">
                    {isFlipped ? cardApplication.card_number : '•••• •••• •••• ••••'}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-white/70 text-xs">Card Holder</div>
                      <div className="text-white text-sm">{cardApplication.name.toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs">Expires</div>
                      <div className="text-white text-sm">{cardApplication.expiry_date}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Back of Card */}
              <div className="card-back">
                <div className="w-full h-56 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-2xl p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white font-bold">Card Details</div>
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-white/70 text-xs">Card Number</div>
                      <div className="text-white font-medium">{cardApplication.card_number}</div>
                    </div>
                    <div className="flex space-x-6">
                      <div>
                        <div className="text-white/70 text-xs">Expiry Date</div>
                        <div className="text-white">{cardApplication.expiry_date}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs">CVV</div>
                        <div className="text-white">{cardApplication.cvv}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-white/70 text-xs text-center">
                    Virtual card for online purchases only
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-white/70 text-sm">
            {isFlipped ? 'Click to hide details' : 'Click to show details'}
          </div>
        </div>
        
        {isFlipped && (
          <div className="bg-indigo-800/30 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-white">Card Information</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyCardNumber();
                }}
                className="btn bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-3 flex items-center"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Number
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/70 text-xs">Card Holder</p>
                <p className="text-white">{cardApplication.name}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Card Number</p>
                <p className="text-white">{cardApplication.card_number}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Expiry Date</p>
                <p className="text-white">{cardApplication.expiry_date}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">CVV</p>
                <p className="text-white">{cardApplication.cvv}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="font-medium text-white mb-2">Security Notice</h3>
          <ul className="text-white/80 text-sm space-y-1 list-disc pl-4">
            <li>This card can only be used for online purchases</li>
            <li>Never share your card details with unauthorized parties</li>
            <li>Report any suspicious activity immediately</li>
            <li>Keep your card information secure at all times</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyCardPage;