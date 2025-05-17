import React, { ReactNode } from 'react';

interface ButtonProps {
  onClick: () => void;
  icon?: ReactNode;
  text: string;
  primary?: boolean;
  small?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  icon, 
  text, 
  primary = false,
  small = false 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center transition-all duration-200 
        ${primary 
          ? 'bg-violet-600 hover:bg-violet-700 text-white' 
          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'} 
        ${small 
          ? 'text-xs py-1 px-3 rounded' 
          : 'text-sm py-3 px-6 rounded-md'} 
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50
        transform hover:scale-105 active:scale-95
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;