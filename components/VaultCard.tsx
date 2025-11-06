import React, { useState, useEffect, useCallback } from 'react';
import { TimeVault } from '../types';
import { ClockIcon, PhotoIcon, EyeIcon } from './icons';

interface VaultCardProps {
  vault: TimeVault;
  onSelect: () => void;
}

const Countdown: React.FC<{ unlockDate: Date }> = ({ unlockDate }) => {
    // Fix: Memoize the calculation function to prevent re-creation on every render.
    const calculateTimeLeft = useCallback(() => {
        const difference = +unlockDate - +new Date();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }, [unlockDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const difference = +unlockDate - +new Date();
        if (difference <= 0) {
            // If time is up, ensure the final state is zeroed out and stop the timer.
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
        // Fix: Added dependencies to useEffect to control when it re-runs, preventing an infinite loop of timers.
    }, [timeLeft, calculateTimeLeft, unlockDate]);

    const timerComponents = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds }
    ];

    return (
        <div className="flex justify-center space-x-3 text-cyan-300 font-mono">
           {timerComponents.map(({label, value}) => (
               <div key={label} className="flex flex-col items-center bg-white/5 p-2 rounded-lg w-16">
                    <span className="text-2xl font-bold text-white tracking-wider">{String(value < 0 ? 0 : value).padStart(2, '0')}</span>
                    <span className="text-xs text-gray-400 uppercase">{label}</span>
                </div>
           ))}
        </div>
    );
};


const VaultCard: React.FC<VaultCardProps> = ({ vault, onSelect }) => {
  if (vault.isLocked) {
    return (
      <div className="relative bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg h-72 overflow-hidden group animate-float">
        <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-2xl animate-pulse-slow group-hover:animate-none"></div>
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-cyan-500/10 animate-spin-slow"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h4 className="text-xl font-bold text-white mb-2 truncate w-full px-2">{vault.title}</h4>
          <p className="text-sm text-gray-400 mb-4">Unlocks in</p>
          <Countdown unlockDate={vault.unlockDate} />
        </div>
      </div>
    );
  }

  return (
    <div 
        onClick={onSelect}
        className="bg-gray-800/80 border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-green-500/20 hover:-translate-y-1.5 hover:border-white/20 cursor-pointer group"
    >
      <div className="relative h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
        {vault.media.length > 0 ? (
          <img src={vault.media[0].url} alt={vault.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <PhotoIcon className="w-12 h-12 text-gray-600" />
        )}
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 opacity-100 group-hover:from-black/80"></div>
         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <EyeIcon className="w-8 h-8 text-white" />
            </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-400 mb-1">Unlocked: {vault.unlockDate.toLocaleDateString()}</p>
        <h4 className="text-lg font-bold text-white mb-2 truncate">{vault.title}</h4>
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{vault.description}</p>
      </div>
    </div>
  );
};

export default VaultCard;
