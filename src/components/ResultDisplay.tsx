import React, { useRef, useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import Button from './Button';

interface ResultDisplayProps {
  mergedResult: {
    content: string;
    newEntries: string[];
  } | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ mergedResult }) => {
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    if (!mergedResult) return;
    
    navigator.clipboard.writeText(mergedResult.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!mergedResult) {
    return null;
  }

  const renderContent = () => {
    const lines = mergedResult.content.split('\n');
    return lines.map((line, index) => {
      const isNewEntry = mergedResult.newEntries.some(entry => entry === line);
      
      return (
        <div 
          key={index} 
          className={`${isNewEntry ? 'bg-green-900/30 border-l-2 border-green-500' : ''} py-1 pl-2`}
        >
          {line}
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden animate-fade-in-up">
      <div className="bg-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <FileText size={18} className="text-green-400 mr-2" />
          <h2 className="font-medium">Merged .gitignore Result</h2>
        </div>
        <div className="flex space-x-2">
          <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
            {mergedResult.newEntries.length} New Entries
          </span>
          <Button 
            onClick={copyToClipboard}
            icon={copied ? <Check size={16} /> : <Copy size={16} />}
            text={copied ? "Copied!" : "Copy"}
            small
          />
        </div>
      </div>
      
      <div 
        ref={resultRef}
        className="w-full bg-gray-800 p-4 h-96 font-mono text-sm overflow-auto border-t border-gray-700"
      >
        {renderContent()}
      </div>
      
      <div className="bg-gray-700/50 px-4 py-3 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-sm mr-2"></span>
          Highlighted lines indicate newly added entries from your project's .gitignore
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;