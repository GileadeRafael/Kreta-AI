import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, href, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'text-white bg-sky-500 hover:bg-sky-600 focus:ring-sky-500',
    secondary: 'text-white bg-[#2d2d3d] hover:bg-[#3f3f4d] border border-transparent focus:ring-neutral-500 px-4 py-2',
    ghost: 'text-neutral-300 hover:bg-neutral-800 hover:text-white px-3 py-1.5',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

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