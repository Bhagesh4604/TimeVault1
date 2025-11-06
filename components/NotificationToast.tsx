import React, { useState, useEffect } from 'react';
import { BellIcon } from './icons';

interface NotificationToastProps {
  message: string;
  onHide: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onHide }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // After hiding, call the callback to clear the message in the parent state
        setTimeout(onHide, 500); // Wait for fade out animation
      }, 4500); // Message is visible for 4.5 seconds

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, onHide]);

  return (
    <div
      aria-live="assertive"
      className={`fixed top-5 right-5 z-[100] flex items-center p-4 w-full max-w-xs text-gray-200 bg-gray-800 rounded-xl shadow-lg border border-gray-700 transition-all duration-500 ease-in-out transform ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
      }`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-400 bg-green-800/50 rounded-lg">
        <BellIcon className="w-5 h-5" />
        <span className="sr-only">Bell icon</span>
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
    </div>
  );
};

export default NotificationToast;
