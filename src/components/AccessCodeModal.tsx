'use client';

import { useState, useEffect } from 'react';

interface AccessCodeModalProps {
  onSuccess: () => void;
}

export default function AccessCodeModal({ onSuccess }: AccessCodeModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const correctCode = 'leocg';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toLowerCase() === correctCode.toLowerCase()) {
      // Store in localStorage to remember user has entered correct code
      localStorage.setItem('accessGranted', 'true');
      onSuccess();
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Access Required</h2>
        
        <p className="mb-6 text-gray-600 text-center">
          Please enter the access code to continue to the Lost and Found platform.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter access code"
              className={`w-full px-4 py-3 border-2 rounded-lg ${
                error ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoFocus
            />
            {error && (
              <p className="text-red-500 mt-2 text-sm">
                Incorrect code. Please try again. ({attempts} attempts)
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
} 