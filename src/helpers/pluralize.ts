/**
 * Pluralizes a word based on the given quantity.
 *
 * @param word - The singular form of the word.
 * @param quantity - The quantity to check.
 * @returns The correctly pluralized word.
 */
export function pluralize(word: string, quantity: number): string {
  if (quantity === 1) {
    return word; // Singular form for quantity 1
  }

  // Convert word to lowercase for pluralization rules
  const lowerWord = word.toLowerCase();

  // Irregular plural rules
  const irregularPlurals: Record<string, string> = {
    child: 'children',
    person: 'people',
    tooth: 'teeth',
    foot: 'feet',
    mouse: 'mice',
    goose: 'geese'
  };

  if (irregularPlurals[lowerWord]) {
    return preserveCase(word, irregularPlurals[lowerWord]);
  }

  // Regular pluralization rules
  if (lowerWord.endsWith('y') && !/[aeiou]y$/i.test(lowerWord)) {
    return preserveCase(word, lowerWord.slice(0, -1) + 'ies'); // "city" -> "cities"
  } else if (
    lowerWord.endsWith('s') ||
    lowerWord.endsWith('sh') ||
    lowerWord.endsWith('ch') ||
    lowerWord.endsWith('x') ||
    lowerWord.endsWith('z')
  ) {
    return preserveCase(word, lowerWord + 'es'); // "box" -> "boxes"
  }

  return preserveCase(word, lowerWord + 's'); // Default plural: "book" -> "books"
}

/**
 * Preserves the original case of a word while applying pluralization.
 *
 * @param original - The original word.
 * @param plural - The pluralized word in lowercase.
 * @returns The pluralized word with the same casing as the original.
 */
function preserveCase(original: string, plural: string): string {
  if (original === original.toUpperCase()) {
    return plural.toUpperCase(); // Preserve uppercase
  } else if (original[0] === original[0].toUpperCase()) {
    return plural[0].toUpperCase() + plural.slice(1); // Preserve title case
  }
  return plural; // Preserve lowercase
}
