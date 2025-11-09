import React from 'react';

export default function Logo({ size = 40, className = "" }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle cx="50" cy="50" r="48" fill="url(#gradient)" />
            <path 
                d="M35 40 L35 60 L50 50 Z M50 50 L65 40 L65 60 Z" 
                fill="white" 
                opacity="0.9"
            />
            <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6c8cff" />
                    <stop offset="100%" stopColor="#FF9839" />
                </linearGradient>
            </defs>
        </svg>
    );
}

