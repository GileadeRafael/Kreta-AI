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
    const timer = setTimeout(() => handleClose(), 3800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed bottom-24 right-8 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
      <div className={`glass-card p-4 rounded-2xl flex items-center gap-4 min-w-[280px] border-l-4 ${type === 'success' ? 'border-l-primary' : 'border-l-secondary'}`}>
        <div className="flex-grow">
          <p className="text-[10px] uppercase font-bold text-neutral-500 mb-0.5 tracking-widest">{type === 'success' ? 'Operation Success' : 'System Alert'}</p>
          <p className="text-sm font-semibold text-white">{message}</p>
        </div>
        <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-lg text-neutral-500">
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};