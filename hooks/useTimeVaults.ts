import { useState, useEffect, useCallback } from 'react';
import { TimeVault, TimeVaultData } from '../types';
import { fetchTimeVaults, createTimeVault } from '../services/backendService';

export const useTimeVaults = () => {
  const [vaults, setVaults] = useState<TimeVault[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVaults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedVaults = await fetchTimeVaults();
      setVaults(fetchedVaults);
    } catch (e) {
      setError('Failed to load time vaults.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);
  
  const addVault = useCallback(async (vaultData: TimeVaultData) => {
    try {
      const newVault = await createTimeVault(vaultData);
      // We refetch all vaults to get the correct sorted list with updated lock states
      await loadVaults();
      return newVault;
    } catch (e) {
      setError('Failed to create time vault.');
      console.error(e);
      throw e; // re-throw to be caught in component
    }
  }, [loadVaults]);

  return { vaults, isLoading, error, refreshVaults: loadVaults, addVault };
};
