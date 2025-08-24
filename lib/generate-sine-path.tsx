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
  const pts = [{ x: width / 2, y: 0 }];
  // A full sin wave is: A * sin(B(x - C)) + D
  // A = amplitude
  // B = frequency
  // C = phase shift
  // D = vertical shift
  // In our case, D = width / 2 (to center the wave), C = 0, B = frequency * 2 * PI, A = amplitude
  const B = frequency * 2 * Math.PI;
  const A = amplitude;

  const step = height / points;
  // Start at the center of the canvas, at the top of the screen
  let d = `M ${width / 2} 0`;
  for (let i = 0; i <= points; i++) {
    const y = i * step;
    const x = width / 2 + A * Math.sin(y * B);
    d += ` L ${x} ${y}`;
    pts.push({ x, y });
  }
  return { d, pts };
}
