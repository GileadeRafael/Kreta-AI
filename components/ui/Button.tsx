import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  children: React.ReactNode;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, href, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f0715] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variantStyles = {
    primary: 'text-white bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]',
    secondary: 'text-white bg-[#2a1b3d] hover:bg-[#3b2656] border border-white/10',
    ghost: 'text-neutral-400 hover:bg-white/5 hover:text-white',
    gradient: 'text-white bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className || ''}`;

  if (href) {
    const { type, ...anchorProps } = props;
    return (
      <a href={href} className={combinedClassName} {...(anchorProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};