import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleSolid } from './icons';

interface SettingsPageProps {
  onNavigateBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigateBack }) => {
  const { currentUser, updateProfilePhoto } = useAuth();
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (newPhoto) {
      setIsSaving(true);
      await updateProfilePhoto(newPhoto);
      setIsSaving(false);
      setNewPhoto(null);
      alert("Profile photo updated!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onNavigateBack} className="text-cyan-400 hover:text-cyan-300 mb-6">&larr; Back to Dashboard</button>
      <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">Profile Settings</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            {newPhoto ? (
              <img src={newPhoto} alt="New profile" className="w-24 h-24 rounded-full object-cover" />
            ) : currentUser?.profilePhotoUrl ? (
              <img src={currentUser.profilePhotoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <UserCircleSolid className="w-24 h-24 text-gray-600" />
            )}
          </div>
          <div>
            <p className="text-xl font-semibold text-white">{currentUser?.email}</p>
            <p className="text-gray-400">Manage your profile information.</p>
            <label htmlFor="photo-upload" className="mt-2 inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm">
              Change Photo
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>
        </div>

        {newPhoto && (
            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={() => setNewPhoto(null)}
                    className="bg-gray-600/50 hover:bg-gray-500/50 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Photo'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
