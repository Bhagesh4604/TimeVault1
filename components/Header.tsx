import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Cog6ToothIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from './icons';

interface HeaderProps {
  onNavigate: (view: 'dashboard' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2 font-bold text-white">
          <span className="text-2xl font-semibold text-white">TimeVault</span>
      </div>
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 text-white">
          {currentUser?.profilePhotoUrl ? (
            <img src={currentUser.profilePhotoUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-gray-600 hover:border-cyan-400 transition-colors" />
          ) : (
            <UserCircleIcon className="w-9 h-9 text-gray-400" />
          )}
        </button>
        {menuOpen && (
          <div 
            className="absolute right-0 mt-2 w-56 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-20 animate-fade-in-fast"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="p-2">
              <div className="px-3 py-2">
                <p className="text-sm text-gray-400">Signed in as</p>
                <p className="font-semibold text-white truncate">{currentUser?.email}</p>
              </div>
              <div className="my-1 h-px bg-gray-700"></div>
              <button
                onClick={() => { onNavigate('settings'); setMenuOpen(false); }}
                className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-md transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={logout}
                className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;