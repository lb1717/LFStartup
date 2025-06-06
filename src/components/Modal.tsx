'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the current focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus the modal
      modalRef.current?.focus();

      // Announce modal opening to screen readers
      if (statusRef.current) {
        statusRef.current.textContent = 'Modal opened';
      }
    } else {
      // Restore scrolling
      document.body.style.overflow = 'auto';
      
      // Restore focus
      previousFocusRef.current?.focus();

      // Announce modal closing to screen readers
      if (statusRef.current) {
        statusRef.current.textContent = 'Modal closed';
      }
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      // Announce escape key press to screen readers
      if (statusRef.current) {
        statusRef.current.textContent = 'Modal closed using escape key';
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      // Announce backdrop click to screen readers
      if (statusRef.current) {
        statusRef.current.textContent = 'Modal closed by clicking outside';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Status message for screen readers */}
      <div
        ref={statusRef}
        className="sr-only"
        role="status"
        aria-live="polite"
      ></div>

      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      ></div>
      
      {/* Modal content */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
          aria-label="Close modal"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Content */}
        <div className="p-6">
          {title && <h2 id="modal-title" className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
} 