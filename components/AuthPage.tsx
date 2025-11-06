import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import VerifyPhoneForm from './VerifyPhoneForm';

type AuthForm = 'login' | 'signup' | 'forgotPassword' | 'verifyPhone';

const AuthPage: React.FC = () => {
  const [form, setForm] = useState<AuthForm>('login');
  const [pendingVerificationDetails, setPendingVerificationDetails] = useState<{email: string, phone: string} | null>(null);

  const handleSwitchToVerify = (email: string, phone: string) => {
    setPendingVerificationDetails({ email, phone });
    setForm('verifyPhone');
  };

  const renderForm = () => {
    switch (form) {
      case 'signup':
        return <SignupForm onSwitchToLogin={() => setForm('login')} onSwitchToVerify={handleSwitchToVerify} />;
      case 'forgotPassword':
        return <ForgotPasswordForm onSwitchToLogin={() => setForm('login')} />;
      case 'verifyPhone':
        return <VerifyPhoneForm phone={pendingVerificationDetails?.phone || ''} onSwitchToLogin={() => setForm('login')} />;
      case 'login':
      default:
        return <LoginForm onSwitchToSignup={() => setForm('signup')} onSwitchToForgotPassword={() => setForm('forgotPassword')} />;
    }
  };

  return (
    <div className="min-h-screen aurora-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">TimeVault</h1>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;