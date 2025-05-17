import React from 'react';
import { FileCode, FileEdit, Merge } from 'lucide-react';
import Button from './Button';

interface GitIgnoreInputsProps {
  githubTemplate: string;
  setGithubTemplate: (value: string) => void;
  projectGitignore: string;
  setProjectGitignore: (value: string) => void;
  onMerge: () => void;
}

const GitIgnoreInputs: React.FC<GitIgnoreInputsProps> = ({
  githubTemplate,
  setGithubTemplate,
  projectGitignore,
  setProjectGitignore,
  onMerge
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <FileCode size={18} className="text-violet-400 mr-2" />
            <h2 className="font-medium">GitHub .gitignore Template</h2>
          </div>
          <span className="text-xs bg-violet-600/20 text-violet-400 px-2 py-1 rounded">
            Template
          </span>
        </div>
        <textarea
          className="w-full bg-gray-800 p-4 h-80 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none border-t border-gray-700"
          placeholder="Paste GitHub .gitignore template here..."
          value={githubTemplate}
          onChange={(e) => setGithubTemplate(e.target.value)}
          spellCheck="false"
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <FileEdit size={18} className="text-blue-400 mr-2" />
            <h2 className="font-medium">Your Project .gitignore</h2>
          </div>
          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
            Project
          </span>
        </div>
        <textarea
          className="w-full bg-gray-800 p-4 h-80 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none border-t border-gray-700"
          placeholder="Paste your project's .gitignore here..."
          value={projectGitignore}
          onChange={(e) => setProjectGitignore(e.target.value)}
          spellCheck="false"
        />
      </div>
      
      <div className="lg:col-span-2 flex justify-center">
        <Button 
          onClick={onMerge}
          icon={<Merge size={18} />}
          text="Merge .gitignore Files"
          primary
        />
      </div>
    </div>
  );
};

export default GitIgnoreInputs;