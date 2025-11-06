import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EnvelopeIcon, KeyIcon, PhoneIcon } from './icons';

interface SignupFormProps {
    onSwitchToLogin: () => void;
    onSwitchToVerify: (email: string, phone: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, onSwitchToVerify }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        return setError("Passwords do not match.");
    }
    setError('');
    setIsLoading(true);
    try {
        await signup(email, phone, password);
        onSwitchToVerify(email, phone);
    } catch (err: any) {
        setError(err.message || 'Failed to create an account.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
      {error && <p className="text-red-400 bg-red-500/10 p-3 rounded-md text-sm">{error}</p>}
      <div className="relative">
        <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="email"
          id="email-signup"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="you@example.com"
          required
        />
      </div>
       <div className="relative">
        <PhoneIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="tel"
          id="phone-signup"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Phone number"
          required
        />
      </div>
      <div className="relative">
        <KeyIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="password"
          id="password-signup"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Create a password"
          minLength={6}
          required
        />
      </div>
       <div className="relative">
        <KeyIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="password"
          id="confirm-password-signup"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Confirm password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
      >
        {isLoading ? 'Creating Account...' : 'Continue'}
      </button>
      <p className="text-center text-sm text-gray-400 pt-4">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-cyan-400 hover:text-cyan-300">
            Log in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
