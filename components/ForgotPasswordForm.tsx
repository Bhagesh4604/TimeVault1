import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EnvelopeIcon } from './icons';

interface ForgotPasswordFormProps {
    onSwitchToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    await forgotPassword(email);
    setIsLoading(false);
    setMessage('If an account with that email exists, a password reset link has been sent.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">Reset Password</h2>
      {message && <p className="text-green-400 bg-green-500/10 p-3 rounded-md text-sm">{message}</p>}
      <div className="relative">
        <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="email"
          id="email-forgot"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Enter your account email"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !!message}
        className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <p className="text-center text-sm text-gray-400 pt-4">
        Remembered your password?{' '}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-cyan-400 hover:text-cyan-300">
            Back to Login
        </button>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
