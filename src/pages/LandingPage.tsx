import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="py-6 px-4 container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wallet className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">INAF Wallet</span>
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/login" 
            className="px-4 py-2 rounded-md text-white hover:text-indigo-100 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Smart Digital Wallet for Your Financial Future
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Experience the convenience of digital finance with INAF Wallet. 
              Manage your money, apply for virtual cards, and handle transactions with ease.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/signup" 
                className="btn btn-primary flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                to="/login" 
                className="btn bg-white/10 hover:bg-white/20 text-white"
              >
                Login to Account
              </Link>
            </div>
            <div className="mt-6 bg-white/10 p-3 rounded-md">
              <p className="text-white text-sm">
                <span className="font-bold text-indigo-300">Bonus Offer:</span> Get 1000 Taka on signup!
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
            <div className="relative w-80 h-56">
              <div className="absolute top-0 left-0 w-full h-full card-glassmorphism rounded-xl shadow-2xl transform rotate-6 z-10"></div>
              <div className="absolute top-0 left-0 w-full h-full card-glassmorphism rounded-xl shadow-2xl transform -rotate-3 z-20"></div>
              <div className="absolute top-0 left-0 w-full h-full card-glassmorphism rounded-xl shadow-2xl z-30 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="text-white font-bold">INAF Card</div>
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div className="text-lg text-white font-medium mt-8">
                  •••• •••• •••• 4321
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-white/70 text-xs">Card Holder</div>
                    <div className="text-white text-sm">JOHN DOE</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-xs">Expires</div>
                    <div className="text-white text-sm">05/28</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-indigo-800/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-lg p-6 shadow-lg">
                <Wallet className="h-12 w-12 text-indigo-300 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Digital Wallet</h3>
                <p className="text-white/80">
                  Manage your money digitally, make deposits and withdrawals with ease.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 shadow-lg">
                <CreditCard className="h-12 w-12 text-indigo-300 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Virtual Card</h3>
                <p className="text-white/80">
                  Apply for a virtual card and use it for online purchases anywhere.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 shadow-lg">
                <ShieldCheck className="h-12 w-12 text-indigo-300 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Secure Transactions</h3>
                <p className="text-white/80">
                  All your transactions are encrypted and securely processed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying the benefits of INAF Wallet.
            Sign up today and receive your 1000 Taka bonus!
          </p>
          <Link 
            to="/signup" 
            className="btn btn-primary inline-flex items-center"
          >
            Create Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="bg-indigo-900/70 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Wallet className="h-6 w-6 text-white" />
              <span className="text-lg font-bold text-white">INAF Wallet</span>
            </div>
            <div className="text-white/70 text-sm">
              © 2025 INAF Wallet. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;