import React, { useState } from 'react';
import { useTimeVaults } from '../hooks/useTimeVaults';
import VaultCard from './VaultCard';
import CreateVaultForm from './CreateVaultForm';
import VaultDetailModal from './VaultDetailModal';
import NotificationToast from './NotificationToast';
import { TimeVault, TimeVaultData } from '../types';
import { PlusIcon } from './icons';

const Dashboard: React.FC = () => {
  const { vaults, isLoading, addVault } = useTimeVaults();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedVault, setSelectedVault] = useState<TimeVault | null>(null);
  const [notification, setNotification] = useState('');

  const handleCreateVault = async (vaultData: TimeVaultData) => {
    await addVault(vaultData);
    setNotification('New TimeVault created successfully!');
    setIsCreating(false);
  };
  
  const lockedVaults = vaults.filter(v => v.isLocked);
  const unlockedVaults = vaults.filter(v => !v.isLocked);

  return (
    <>
      {isCreating ? (
        <CreateVaultForm onCreate={handleCreateVault} onClose={() => setIsCreating(false)} />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Your TimeVaults</h1>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create New</span>
            </button>
          </div>

          {isLoading && <p className="text-center text-gray-400">Loading your memories...</p>}

          {!isLoading && vaults.length === 0 && (
              <div className="text-center py-16 px-6 bg-black/10 rounded-2xl border border-dashed border-gray-700">
                  <h3 className="text-xl font-semibold text-white">No TimeVaults yet!</h3>
                  <p className="text-gray-400 mt-2">Click "Create New" to lock your first memory.</p>
              </div>
          )}

          {lockedVaults.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-cyan-500/30 pb-2">Locked & Waiting</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedVaults.map(vault => (
                  <VaultCard key={vault.id} vault={vault} onSelect={() => {}} />
                ))}
              </div>
            </section>
          )}

          {unlockedVaults.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-gray-500/30 pb-2">Unlocked Memories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlockedVaults.map(vault => (
                  <VaultCard key={vault.id} vault={vault} onSelect={() => setSelectedVault(vault)} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
      
      {selectedVault && <VaultDetailModal vault={selectedVault} onClose={() => setSelectedVault(null)} />}
      
      <NotificationToast message={notification} onHide={() => setNotification('')} />
    </>
  );
};

export default Dashboard;
