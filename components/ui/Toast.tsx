
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
    const timer = setTimeout(() => handleClose(), 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed bottom-10 right-8 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
      <div className={`glass-card p-5 rounded-2xl flex items-center gap-4 min-w-[320px] border-l-4 ${type === 'success' ? 'border-l-primary shadow-[0_10px_40px_rgba(163,255,18,0.1)]' : 'border-l-red-500 shadow-[0_10px_40px_rgba(239,68,68,0.1)]'}`}>
        <div className="flex-grow">
          <p className={`text-[10px] uppercase font-black mb-1 tracking-widest leading-none ${type === 'success' ? 'text-primary' : 'text-red-500'}`}>
            {type === 'success' ? 'Zion Notification' : 'System Alert'}
          </p>
          <p className="text-sm font-bold text-white leading-tight">{message}</p>
        </div>
        <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-xl text-neutral-500 transition-colors">
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
