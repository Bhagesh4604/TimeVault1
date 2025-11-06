import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface VerifyPhoneFormProps {
  phone: string;
  onSwitchToLogin: () => void;
}

const VerifyPhoneForm: React.FC<VerifyPhoneFormProps> = ({ phone, onSwitchToLogin }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyPhoneAndLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyPhoneAndLogin(code);
      // On success, the AuthProvider will handle logging in
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mask the phone number for display
  const maskedPhone = phone ? `+${'*'.repeat(phone.length - 4)}${phone.slice(-4)}` : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">Verify Your Phone</h2>
      <p className="text-center text-gray-400">
        Enter the 6-digit code sent to {maskedPhone}.
        <span className="block text-sm text-cyan-400 mt-1">For this demo, the code is <strong>123456</strong>.</span>
      </p>
      {error && <p className="text-red-400 bg-red-500/10 p-3 rounded-md text-sm">{error}</p>}
      
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-center text-2xl tracking-[.5em] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        placeholder="••••••"
        maxLength={6}
        required
      />
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
      >
        {isLoading ? 'Verifying...' : 'Verify & Create Account'}
      </button>
      
      <p className="text-center text-sm text-gray-400 pt-4">
        Wrong number?{' '}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-cyan-400 hover:text-cyan-300">
            Go back
        </button>
      </p>
    </form>
  );
};

export default VerifyPhoneForm;