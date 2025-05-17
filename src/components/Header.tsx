import React from 'react';
import { Github, FileCode } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 py-6 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-violet-600 p-2 rounded-lg">
            <FileCode size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">GitPrune</h1>
            <p className="text-gray-400 text-sm">Efficiently prune and merge your .gitignore files</p>
          </div>
        </div>
        
        <a 
          href="https://github.com/github/gitignore" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
        >
          <Github size={18} className="mr-2" />
          <span>GitHub Templates</span>
        </a>
      </div>
    </header>
  );
};

export default Header;