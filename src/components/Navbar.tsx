import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, LogOut, Menu, X, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { balance, hasCard } = useWallet();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-indigo-900/70 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">INAF Wallet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center px-4 py-2 rounded-md bg-indigo-800/50">
              <span className="text-white font-medium">Balance: </span>
              <span className="ml-2 text-white font-bold">{balance} Tk</span>
            </div>
            
            <Link 
              to="/dashboard" 
              className="text-white hover:text-indigo-200 transition-colors"
            >
              Dashboard
            </Link>
            
            {hasCard ? (
              <Link 
                to="/my-card" 
                className="text-white hover:text-indigo-200 transition-colors flex items-center"
              >
                <CreditCard className="mr-1 h-4 w-4" />
                My Card
              </Link>
            ) : (
              <Link 
                to="/apply-card" 
                className="text-white hover:text-indigo-200 transition-colors"
              >
                Apply for Card
              </Link>
            )}
            
            <Link 
              to="/my-email" 
              className="text-white hover:text-indigo-200 transition-colors"
            >
              My Email
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center text-white hover:text-pink-200 transition-colors"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex items-center justify-center px-4 py-2 rounded-md bg-indigo-800/50 mb-4">
              <span className="text-white font-medium">Balance: </span>
              <span className="ml-2 text-white font-bold">{balance} Tk</span>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link 
                to="/dashboard" 
                className="text-white hover:text-indigo-200 transition-colors px-4 py-2"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              
              {hasCard ? (
                <Link 
                  to="/my-card" 
                  className="text-white hover:text-indigo-200 transition-colors px-4 py-2 flex items-center"
                  onClick={toggleMenu}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  My Card
                </Link>
              ) : (
                <Link 
                  to="/apply-card" 
                  className="text-white hover:text-indigo-200 transition-colors px-4 py-2"
                  onClick={toggleMenu}
                >
                  Apply for Card
                </Link>
              )}
              
              <Link 
                to="/my-email" 
                className="text-white hover:text-indigo-200 transition-colors px-4 py-2"
                onClick={toggleMenu}
              >
                My Email
              </Link>
              
              <button 
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="flex items-center text-white hover:text-pink-200 transition-colors px-4 py-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
            
            <div className="border-t border-indigo-700 my-4"></div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;