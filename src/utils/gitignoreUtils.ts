/**
 * Enhanced utility functions for processing and merging .gitignore files
 * - Enhanced duplicate detection ignoring punctuation and formatting differences
 * - Smart categorization under existing headings instead of separate section
 */

/**
 * Normalizes a gitignore entry for comparison by:
 * - Trimming whitespace
 * - Removing all punctuation (., *, /, etc.)
 * - Converting to lowercase for case-insensitive comparison
 */
function normalizeEntryForComparison(entry: string): string {
  let normalized = entry.trim();
  
  // Remove all punctuation and special characters for comparison
  // This catches cases like:
  // - "node_modules/" vs "node_modules"
  // - "pnpm-debug.log*" vs "pnpm-debug.log"
  // - ".env.local" vs "env.local"
  normalized = normalized.replace(/[^\w\s-]/g, '');
  
  // Remove extra spaces and convert to lowercase
  normalized = normalized.replace(/\s+/g, '').toLowerCase();
  
  return normalized;
}

/**
 * Processes a gitignore file and extracts meaningful entries
 */
export function processGitignoreEntries(content: string): string[] {
  const lines = content.split('\n');
  return lines.filter(line => {
    const trimmedLine = line.trim();
    return trimmedLine !== '' && !trimmedLine.startsWith('#');
  });
}

/**
 * Finds the best section to insert a new entry based on existing headings
 */
function findBestSectionForEntry(entry: string, templateLines: string[]): number {
  const normalizedEntry = normalizeEntryForComparison(entry);
  
  // Define common categories and their keywords
  const categories = [
    { keywords: ['node', 'npm', 'yarn', 'pnpm'], patterns: ['node_modules', 'package-lock', 'yarn.lock', 'pnpm-lock'] },
    { keywords: ['log', 'debug'], patterns: ['log', 'debug'] },
    { keywords: ['dist', 'build', 'output'], patterns: ['dist', 'build', 'out', 'target'] },
    { keywords: ['env', 'environment'], patterns: ['.env', 'environment'] },
    { keywords: ['cache', 'temp', 'tmp'], patterns: ['cache', 'temp', 'tmp'] },
    { keywords: ['test', 'coverage'], patterns: ['test', 'coverage', 'nyc'] },
    { keywords: ['ide', 'editor'], patterns: ['.vscode', '.idea', '.sublime'] }
  ];
  
  // Find the best matching section
  let bestSectionEnd = -1;
  let bestScore = 0;
  
  for (let i = 0; i < templateLines.length; i++) {
    const line = templateLines[i].trim();
    
    // Check if this is a heading
    if (line.startsWith('#') && !line.startsWith('##')) {
      const headingText = line.toLowerCase();
      
      // Calculate relevance score for this section
      let score = 0;
      for (const category of categories) {
        // Check if entry matches this category
        const entryMatchesCategory = category.patterns.some(pattern => 
          normalizedEntry.includes(pattern.toLowerCase())
        );
        
        if (entryMatchesCategory) {
          // Check if heading matches this category
          const headingMatchesCategory = category.keywords.some(keyword =>
            headingText.includes(keyword)
          );
          
          if (headingMatchesCategory) {
            score = 10; // Perfect match
            break;
          }
        }
      }
      
      // If we found a good match, find the end of this section
      if (score > bestScore) {
        bestScore = score;
        // Find the end of this section (next heading or end of file)
        let sectionEnd = i + 1;
        while (sectionEnd < templateLines.length) {
          const nextLine = templateLines[sectionEnd].trim();
          if (nextLine.startsWith('#') && !nextLine.startsWith('##')) {
            break;
          }
          sectionEnd++;
        }
        bestSectionEnd = sectionEnd - 1;
      }
    }
  }
  
  return bestSectionEnd;
}

/**
 * Merges two .gitignore files while eliminating duplicates
 * and intelligently placing entries under appropriate existing headings
 */
export function mergeGitIgnoreFiles(template: string, projectGitignore: string): {
  content: string;
  newEntries: string[];
} {
  const templateLines = template.split('\n');
  const projectLines = projectGitignore.split('\n');
  
  // Get actual entries for comparison
  const templateEntries = processGitignoreEntries(template);
  const projectEntries = processGitignoreEntries(projectGitignore);
  
  // Create a set of normalized template entries for duplicate detection
  const templateEntriesSet = new Set(templateEntries.map(normalizeEntryForComparison));
  
  // Find unique entries from project
  const uniqueEntries: string[] = [];
  const newEntries: string[] = [];
  
  for (const line of projectLines) {
    const trimmedLine = line.trim();
    
    // Skip comments and empty lines for now
    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      continue;
    }
    
    // Check if this entry is truly unique
    const normalizedEntry = normalizeEntryForComparison(trimmedLine);
    if (!templateEntriesSet.has(normalizedEntry)) {
      uniqueEntries.push(trimmedLine);
      newEntries.push(trimmedLine);
    }
  }
  
  // If no unique entries, return original template
  if (uniqueEntries.length === 0) {
    return {
      content: template,
      newEntries: []
    };
  }
  
  // Create a copy of template lines to modify
  const mergedLines = [...templateLines];
  
  // Group entries by their best section and insert them
  const insertions: { [key: number]: string[] } = {};
  const fallbackEntries: string[] = [];
  
  for (const entry of uniqueEntries) {
    const bestSection = findBestSectionForEntry(entry, templateLines);
    
    if (bestSection >= 0) {
      if (!insertions[bestSection]) {
        insertions[bestSection] = [];
      }
      insertions[bestSection].push(entry);
    } else {
      fallbackEntries.push(entry);
    }
  }
  
  // Insert entries in reverse order to maintain line numbers
  const sortedInsertions = Object.entries(insertions).sort(([a], [b]) => parseInt(b) - parseInt(a));
  
  for (const [sectionEnd, entries] of sortedInsertions) {
    const insertIndex = parseInt(sectionEnd) + 1;
    
    // Find the actual last non-empty line in this section
    let actualInsertIndex = parseInt(sectionEnd);
    while (actualInsertIndex >= 0 && mergedLines[actualInsertIndex].trim() === '') {
      actualInsertIndex--;
    }
    actualInsertIndex++; // Insert after the last non-empty line
    
    // Check if the next non-empty line after our insertion point is a heading
    let nextLineIndex = actualInsertIndex;
    while (nextLineIndex < mergedLines.length && mergedLines[nextLineIndex].trim() === '') {
      nextLineIndex++;
    }
    
    const nextLineIsHeading = nextLineIndex < mergedLines.length && 
                              mergedLines[nextLineIndex].trim().startsWith('#');
    
    // Insert entries directly after the last item in the section
    mergedLines.splice(actualInsertIndex, 0, ...entries);
    
    // If the next line is a heading, ensure there's a blank line separator
    if (nextLineIsHeading) {
      // Check if there's already a blank line
      const lineAfterEntries = actualInsertIndex + entries.length;
      if (lineAfterEntries < mergedLines.length && 
          mergedLines[lineAfterEntries].trim() !== '') {
        mergedLines.splice(lineAfterEntries, 0, '');
      }
    }
  }
  
  // Add fallback entries at the end if any
  if (fallbackEntries.length > 0) {
    mergedLines.push('', '# Project-specific entries', ...fallbackEntries);
  }
  
  return {
    content: mergedLines.join('\n'),
    newEntries: newEntries
  };
}