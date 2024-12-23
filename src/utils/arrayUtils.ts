export function shuffleArray<T>(array: T[]): { shuffled: T[], originalIndices: number[] } {
  const shuffled = [...array];
  const originalIndices = Array.from({ length: array.length }, (_, i) => i);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    // Swap indices
    [originalIndices[i], originalIndices[j]] = [originalIndices[j], originalIndices[i]];
  }
  
  return { shuffled, originalIndices };
} 