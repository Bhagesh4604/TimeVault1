import React from 'react';
import { TimeVault } from '../types';
import { XMarkIcon, ClockIcon } from './icons';

interface VaultDetailModalProps {
  vault: TimeVault;
  onClose: () => void;
}

const VaultDetailModal: React.FC<VaultDetailModalProps> = ({ vault, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-cyan-500/20 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
          <XMarkIcon className="w-8 h-8" />
        </button>

        {vault.media.length > 0 && (
          <div className="h-64 bg-gray-900 rounded-t-2xl overflow-hidden">
             <img src={vault.media[0].url} alt={vault.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
            <p className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <ClockIcon className="w-4 h-4" />
                <span>Unlocked on {vault.unlockDate.toLocaleDateString()}</span>
            </p>
          <h2 className="text-3xl font-bold text-white mb-4">{vault.title}</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{vault.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VaultDetailModal;
