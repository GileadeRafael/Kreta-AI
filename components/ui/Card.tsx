
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-[#1c1c1c] border border-white/5 rounded-2xl p-3 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(163,255,18,0.05)] ${className}`}
    >
      {children}
    </div>
  );
};
