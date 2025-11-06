import { TimeVault, TimeVaultData, MediaItem } from '../types';

const VAULTS_KEY = 'timevault_mock_vaults';

const getMockVaults = (): TimeVault[] => {
  const vaults = localStorage.getItem(VAULTS_KEY);
  if (vaults) {
    // Dates are stored as strings, need to convert them back
    return JSON.parse(vaults).map((v: any) => ({ ...v, unlockDate: new Date(v.unlockDate) }));
  }
  // Create default vaults if none exist
  const now = new Date();
  const defaultVaults: TimeVault[] = [
    {
      id: 'vault-1',
      title: 'Our Trip to the Mountains',
      description: 'Remember the crisp air and the beautiful sunrise? We promised to come back here in five years. I wonder what we\'ll be like then. Hope we\'re still just as adventurous!',
      media: [{ id: 'media-1', type: 'image', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' }],
      unlockDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365), // 1 year from now
      isLocked: true,
    },
    {
      id: 'vault-2',
      title: 'First Day at the New Job',
      description: 'Felt so nervous but also excited for this new chapter. This is a reminder of the beginning. Hope you\'ve grown and learned a lot since this day.',
      media: [],
      unlockDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10), // Unlocked 10 days ago
      isLocked: false,
    },
  ];
  localStorage.setItem(VAULTS_KEY, JSON.stringify(defaultVaults));
  return defaultVaults;
};

const saveMockVaults = (vaults: TimeVault[]) => {
  localStorage.setItem(VAULTS_KEY, JSON.stringify(vaults));
};

export const fetchTimeVaults = async (): Promise<TimeVault[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const vaults = getMockVaults();
      const now = new Date();
      // Update lock status based on current time
      const updatedVaults = vaults.map(v => ({
        ...v,
        isLocked: v.unlockDate > now,
      }));
      resolve(updatedVaults.sort((a, b) => +a.unlockDate - +b.unlockDate));
    }, 500);
  });
};

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const createTimeVault = async (vaultData: TimeVaultData): Promise<TimeVault> => {
    return new Promise(async (resolve) => {
        const mediaWithDataUrls: MediaItem[] = await Promise.all(
            vaultData.media.map(async (item) => {
                if (item.file) {
                    const dataUrl = await fileToDataUrl(item.file);
                    return { ...item, url: dataUrl, file: undefined }; // Remove file before saving
                }
                return item;
            })
        );

        const newVault: TimeVault = {
            id: `vault-${Date.now()}`,
            ...vaultData,
            media: mediaWithDataUrls,
            isLocked: vaultData.unlockDate > new Date(),
        };

        setTimeout(() => {
            const vaults = getMockVaults();
            const updatedVaults = [...vaults, newVault];
            saveMockVaults(updatedVaults);
            resolve(newVault);
        }, 500);
    });
};
