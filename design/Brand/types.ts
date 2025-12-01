/**
 * Standard color scale with 11 shades from 50 (lightest) to 950 (darkest)
 *
 * Follows modern design system conventions (Tailwind, Radix, etc.)
 *
 * @example
 * ```typescript
 * const blue: ColorScale = {
 *   50: '#eff6ff',
 *   100: '#dbeafe',
 *   200: '#bfdbfe',
 *   300: '#93c5fd',
 *   400: '#60a5fa',
 *   500: '#3b82f6',  // Base shade
 *   600: '#2563eb',
 *   700: '#1d4ed8',
 *   800: '#1e40af',
 *   900: '#1e3a8a',
 *   950: '#172554'
 * }
 * ```
 */
export type ColorScale = Record<
    50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950,
    string
>
