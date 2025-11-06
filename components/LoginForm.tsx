import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EnvelopeIcon, KeyIcon } from './icons';

interface LoginFormProps {
    onSwitchToSignup: () => void;
    onSwitchToForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
        await login(email, password);
    } catch (err: any) {
        setError(err.message || 'Failed to log in.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">Log In</h2>
      {error && <p className="text-red-400 bg-red-500/10 p-3 rounded-md text-sm">{error}</p>}
      <div className="relative">
        <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="email"
          id="email-login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="relative">
        <KeyIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="password"
          id="password-login"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="••••••••"
          required
        />
      </div>
      <div className="text-right">
        <button type="button" onClick={onSwitchToForgotPassword} className="text-sm text-cyan-400 hover:underline">
            Forgot Password?
        </button>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
      >
        {isLoading ? 'Logging In...' : 'Log In'}
      </button>
      <p className="text-center text-sm text-gray-400 pt-4">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="font-medium text-cyan-400 hover:text-cyan-300">
            Sign up
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
