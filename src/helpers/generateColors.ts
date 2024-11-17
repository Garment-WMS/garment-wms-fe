export const generateColors = (count: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate random color using HSL
      const hue = Math.floor((360 / count) * i); // Evenly distribute colors across the hue spectrum
      const color = `hsl(${hue}, 70%, 50%)`; // Adjust saturation and lightness as needed
      colors.push(color);
    }
    return colors;
  };