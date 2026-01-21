/**
 * Parse ISO 8601 Duration to Human-Readable Format
 *
 * Converts duration strings like "PT2H8M" to "128 min"
 *
 * @param duration - ISO 8601 duration string (e.g., "PT2H8M", "PT1H30M", "PT45M")
 * @returns Formatted duration string (e.g., "128 min", "90 min", "45 min")
 *
 * @example
 * parseDuration("PT2H8M") // "128 min"
 * parseDuration("PT1H30M") // "90 min"
 * parseDuration("PT45M") // "45 min"
 */
export function parseDuration(duration: string): string {
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  const totalMinutes = hours * 60 + minutes;

  return `${totalMinutes} min`;
}
