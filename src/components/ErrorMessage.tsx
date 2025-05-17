import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-6 flex items-start animate-fade-in">
      <AlertTriangle size={20} className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-200 font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-red-400 hover:text-red-300 focus:outline-none ml-2"
        aria-label="Close error message"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ErrorMessage;