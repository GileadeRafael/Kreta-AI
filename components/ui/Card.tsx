import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-[#1c1c1c] border border-[#2d2d3d] rounded-2xl p-3 transition-all duration-300 hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] ${className}`}
    >
      {children}
    </div>
  );
};