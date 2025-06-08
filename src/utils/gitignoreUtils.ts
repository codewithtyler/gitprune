/**
 * Updated utility functions for processing and merging .gitignore files
 * Fixed duplicate removal logic to properly eliminate duplicate entries
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
 * Normalizes a gitignore entry for comparison by trimming whitespace
 */
function normalizeEntry(entry: string): string {
  return entry.trim();
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
  
  // Create a set of normalized template entries for fast lookup
  const templateEntriesSet = new Set(templateEntries.map(normalizeEntry));
  
  // Find unique entries and lines from project's gitignore
  const uniqueProjectLines: string[] = [];
  const newEntries: string[] = [];
  
  // Process each line from the project gitignore
  for (const line of projectLines) {
    const trimmedLine = line.trim();
    
    // Always include comments and empty lines
    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      uniqueProjectLines.push(line);
      continue;
    }
    
    // Check if this entry already exists in the template
    if (!templateEntriesSet.has(normalizeEntry(trimmedLine))) {
      uniqueProjectLines.push(line);
      newEntries.push(trimmedLine);
    }
    // If it's a duplicate, we skip it (don't add to uniqueProjectLines)
  }
  
  // Build the merged content
  let mergedContent = template;
  
  // Add project-specific entries if there are any
  if (uniqueProjectLines.length > 0) {
    // Check if we have any non-empty, non-comment lines
    const hasActualEntries = uniqueProjectLines.some(line => {
      const trimmed = line.trim();
      return trimmed !== '' && !trimmed.startsWith('#');
    });
    
    if (hasActualEntries) {
      mergedContent += '\n\n# Project-specific entries\n';
      mergedContent += uniqueProjectLines.join('\n');
    }
  }
  
  return {
    content: mergedContent,
    newEntries: newEntries
  };
}