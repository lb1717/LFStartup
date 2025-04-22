import React from 'react';

interface NoImagePlaceholderProps {
  alt?: string;
  className?: string;
}

export default function NoImagePlaceholder({ 
  alt = "No image available", 
  className = "" 
}: NoImagePlaceholderProps) {
  return (
    <div 
      className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
      role="img"
      aria-label={alt}
    >
      <div className="text-center p-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 mx-auto mb-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <p className="text-sm font-medium">No Image</p>
      </div>
    </div>
  );
} 