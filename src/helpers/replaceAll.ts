export function replaceAll(str: string, search: string, replacement:string) {
    // Escape special characters if 'search' is a string
    const escapedSearch = typeof search === 'string' 
      ? search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') 
      : search;
  
    // Use global regular expression to replace all occurrences
    const regExp = new RegExp(escapedSearch, 'g');
    return str.replace(regExp, replacement);
  }