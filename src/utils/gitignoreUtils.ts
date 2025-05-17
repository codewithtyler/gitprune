/**
 * Utility functions for processing and merging .gitignore files
 */

/**
 * Processes a gitignore file and extracts meaningful entries
 * (skipping comments and empty lines when comparing)
 */
export function processGitignoreEntries(content: string): string[] {
  // Split the content into lines
  const lines = content.split('\n');
  
  // Filter out comments and empty lines for comparison purposes
  return lines.filter(line => {
    const trimmedLine = line.trim();
    return trimmedLine !== '' && !trimmedLine.startsWith('#');
  });
}

/**
 * Merges two .gitignore files while eliminating duplicates
 * and preserving formatting/comments from the template
 */
export function mergeGitIgnoreFiles(template: string, projectGitignore: string): {
  content: string;
  newEntries: string[];
} {
  // Process the template and project gitignore
  const templateLines = template.split('\n');
  const projectLines = projectGitignore.split('\n');
  
  // Get actual entries for comparison (excluding comments and empty lines)
  const templateEntries = processGitignoreEntries(template);
  const projectEntries = processGitignoreEntries(projectGitignore);
  
  // Find unique entries from project's gitignore (not in template)
  const uniqueProjectEntries = projectEntries.filter(
    entry => !templateEntries.some(templateEntry => 
      templateEntry.trim() === entry.trim()
    )
  );
  
  // Get the original lines from project that correspond to unique entries
  const uniqueProjectLines = projectLines.filter(line => {
    const trimmedLine = line.trim();
    return uniqueProjectEntries.includes(trimmedLine) || 
           (trimmedLine.startsWith('#') || trimmedLine === '');
  });
  
  // Build the merged content
  let mergedContent = template;
  
  // Add a separator if there are unique entries to add
  if (uniqueProjectEntries.length > 0) {
    mergedContent += '\n\n# Project-specific entries\n';
    mergedContent += uniqueProjectLines.join('\n');
  }
  
  return {
    content: mergedContent,
    newEntries: uniqueProjectEntries
  };
}