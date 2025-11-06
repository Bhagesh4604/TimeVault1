// User object for authentication context & mock database
export interface User {
  id: string;
  email: string;
  phone: string;
  password?: string; // Stored in mock DB, not sent to client
  profilePhotoUrl?: string | null;
  phoneVerified: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  profilePhotoUrl?: string | null;
  phoneVerified: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image';
  url: string;
  file?: File; // The raw file, used for uploads
}

export interface TimeVault {
  id: string;
  title: string;
  description: string;
  media: MediaItem[];
  unlockDate: Date;
  isLocked: boolean;
}

// Data needed to create a new TimeVault
export interface TimeVaultData {
  title: string;
  description: string;
  unlockDate: Date;
  media: MediaItem[];
}
