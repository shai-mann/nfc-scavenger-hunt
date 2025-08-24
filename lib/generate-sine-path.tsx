/**
 * Generates a sine path for a given width, height, amplitude, and frequency. The sine path is facing DOWN.
 * @param width - The width of the path.
 * @param height - The height of the path.
 * @param amplitude - The amplitude of the sine wave.
 * @param frequency - The frequency of the sine wave.
 * @param points - The number of points to generate.
 * @returns The path as a string.
 */
export function generateSinePath({
  width,
  height,
  amplitude,
  frequency,
  points = 100,
}: {
  width: number;
  height: number;
  amplitude: number;
  frequency: number;
  points?: number;
}) {
  const step = height / points;
  // Start at the center of the canvas, at the top of the screen
  let d = `M ${width / 2} 0 L ${width / 2} ${height}`;
  //   for (let i = 0; i <= points; i++) {
  //     const y = i * step;
  //     const x =
  //       width / 2 + amplitude * Math.sin((y / height) * frequency * Math.PI * 2);
  //     d += ` L ${x} ${y}`;
  //   }
  return d;
}
