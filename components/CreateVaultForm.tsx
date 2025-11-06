import React, { useState, useCallback } from 'react';
import { TimeVaultData, MediaItem } from '../types';
import { generateDescriptionSuggestion } from '../services/geminiService';
import { ArrowPathIcon, PhotoIcon, XCircleIcon } from './icons';

interface CreateVaultFormProps {
  onCreate: (vaultData: TimeVaultData) => Promise<void>;
  onClose: () => void;
}

const CreateVaultForm: React.FC<CreateVaultFormProps> = ({ onCreate, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleGenerateDescription = async () => {
    if (!title && media.length === 0) {
        alert("Please enter a title or add an image first.");
        return;
    }
    setIsGenerating(true);
    const suggestion = await generateDescriptionSuggestion(title, media);
    setDescription(suggestion);
    setIsGenerating(false);
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const newMediaItems = Array.from(files).map(file => ({
        id: `media-${Date.now()}-${Math.random()}`,
        type: 'image' as 'image',
        url: URL.createObjectURL(file),
        file: file,
      }));
      setMedia(prev => [...prev, ...newMediaItems]);
    }
  };

  const removeMedia = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockDate) {
        alert("Please select an unlock date.");
        return;
    }
    setIsSubmitting(true);
    const vaultData: TimeVaultData = {
        title,
        description,
        unlockDate: new Date(unlockDate),
        media,
    };
    await onCreate(vaultData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Create a New TimeVault</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="e.g., Summer Vacation 2025"
            required
          />
        </div>
        
        <div>
          <label htmlFor="media" className="block text-sm font-medium text-gray-300 mb-2">Add Photos</label>
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed ${dragActive ? 'border-cyan-400' : 'border-gray-600'} rounded-lg p-6 text-center transition-colors`}
          >
            <input
              type="file"
              id="media-upload"
              multiple
              accept="image/*"
              onChange={e => handleFileChange(e.target.files)}
              className="hidden"
            />
            <label htmlFor="media-upload" className="cursor-pointer">
              <PhotoIcon className="w-10 h-10 mx-auto text-gray-500" />
              <p className="mt-2 text-gray-400">Drag & drop photos here, or click to select</p>
            </label>
          </div>
          {media.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {media.map(item => (
                <div key={item.id} className="relative group">
                  <img src={item.url} alt="preview" className="w-full h-24 object-cover rounded-md" />
                  <button type="button" onClick={() => removeMedia(item.id)} className="absolute -top-2 -right-2 bg-gray-800 rounded-full text-white hover:text-red-400">
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Message to Your Future Self</label>
            <div className="relative">
                <textarea
                    id="description"
                    rows={6}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Describe the memory, your feelings, or a note for your future self..."
                    required
                />
                <button 
                    type="button" 
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || (!title && media.length === 0)}
                    className="absolute bottom-3 right-3 flex items-center gap-2 text-xs bg-cyan-600/80 hover:bg-cyan-500/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-1 px-3 rounded-md transition-colors"
                >
                    {isGenerating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : '✨'}
                    {isGenerating ? 'Generating...' : 'AI Suggest'}
                </button>
            </div>
        </div>

        <div>
            <label htmlFor="unlockDate" className="block text-sm font-medium text-gray-300 mb-2">Unlock Date</label>
            <input
                type="datetime-local"
                id="unlockDate"
                value={unlockDate}
                onChange={e => setUnlockDate(e.target.value)}
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                required
            />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
            <button
                type="button"
                onClick={onClose}
                className="bg-gray-600/50 hover:bg-gray-500/50 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
            >
                {isSubmitting ? 'Creating...' : 'Lock this Memory'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVaultForm;
