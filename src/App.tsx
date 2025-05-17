import React, { useState } from 'react';
import { Github, Merge, AlertTriangle } from 'lucide-react';
import GitIgnoreInputs from './components/GitIgnoreInputs';
import ResultDisplay from './components/ResultDisplay';
import { mergeGitIgnoreFiles } from './utils/gitignoreUtils';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';

function App() {
  const [githubTemplate, setGithubTemplate] = useState('');
  const [projectGitignore, setProjectGitignore] = useState('');
  const [mergedResult, setMergedResult] = useState<{
    content: string;
    newEntries: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMerge = () => {
    try {
      // Validate inputs
      if (!githubTemplate.trim() && !projectGitignore.trim()) {
        setError('Both input fields cannot be empty');
        return;
      }

      if (!githubTemplate.trim()) {
        setError('GitHub template field cannot be empty');
        return;
      }

      if (!projectGitignore.trim()) {
        setError('Project .gitignore field cannot be empty');
        return;
      }

      // Clear any previous errors
      setError(null);

      // Perform the merge
      const result = mergeGitIgnoreFiles(githubTemplate, projectGitignore);
      setMergedResult(result);
    } catch (err) {
      setError(`Error merging files: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        
        <GitIgnoreInputs 
          githubTemplate={githubTemplate}
          setGithubTemplate={setGithubTemplate}
          projectGitignore={projectGitignore}
          setProjectGitignore={setProjectGitignore}
          onMerge={handleMerge}
        />
        
        <ResultDisplay mergedResult={mergedResult} />
      </main>
      
      <footer className="bg-gray-800 py-4 px-6 text-center text-gray-400">
        <p>GitPrune &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;