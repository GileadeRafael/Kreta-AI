import React, { useEffect, useState } from 'react';
import { XIcon } from '../icons/XIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, 3800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200); // allow for fade-out animation
  };

  const baseStyles = 'fixed top-5 right-5 z-[100] flex items-center p-4 max-w-sm w-full rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200';
  const typeStyles = {
    success: 'bg-sky-500/20 border-sky-500/50 text-white',
    error: 'bg-red-500/20 border-red-500/50 text-white',
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex-grow text-sm">{message}</div>
      <button onClick={handleClose} className="ml-4 p-1 rounded-full hover:bg-white/10">
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};