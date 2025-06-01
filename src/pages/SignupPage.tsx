import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please log in or use a different email.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-glassmorphism rounded-2xl p-8 animate-fade-in">
          <Link to="/" className="flex items-center text-indigo-200 mb-6 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-indigo-200 mb-6">
            Sign up now and get 1000 Taka bonus!
          </p>
          
          {error && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="name" className="text-white mb-1 block">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                  <User className="h-5 w-5" />
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="text-white mb-1 block">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="text-white mb-1 block">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10 w-full"
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="text-white mb-1 block">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Confirm your password"
                  required
                />
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
                    Creating Account...
                  </span>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-300 hover:text-indigo-100 font-medium">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;