
import React from 'react';

export const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M15.441 15.441a6.364 6.364 0 0 0 -8.882 -8.882" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
    </svg>
);
