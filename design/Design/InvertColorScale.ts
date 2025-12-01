/**
 * Inverts a color scale by swapping light and dark shades
 *
 * Mirrors color scale values for automatic dark theme generation:
 * - 50 ↔ 950
 * - 100 ↔ 900
 * - 200 ↔ 800
 * - 300 ↔ 700
 * - 400 ↔ 600
 * - 500 stays 500 (center point)
 *
 * @template T - Color scale type (Record<number, string>)
 *
 * @example
 * ```typescript
 * type BlueScale = {
 *   50: '#eff6ff',
 *   500: '#3b82f6',
 *   950: '#172554'
 * }
 *
 * type InvertedBlue = InvertColorScale<BlueScale>
 * // Result: { 50: '#172554', 500: '#3b82f6', 950: '#eff6ff' }
 * ```
 */
type InvertColorScale<T extends Record<number, string>> = {
    [K in keyof T]: T[K extends 50
        ? 950
        : K extends 100
          ? 900
          : K extends 200
            ? 800
            : K extends 300
              ? 700
              : K extends 400
                ? 600
                : K extends 500
                  ? 500
                  : K extends 600
                    ? 400
                    : K extends 700
                      ? 300
                      : K extends 800
                        ? 200
                        : K extends 900
                          ? 100
                          : K extends 950
                            ? 50
                            : never]
}

export default InvertColorScale

/**
 * Deeply inverts nested color scales
 *
 * Recursively applies color scale inversion to nested objects,
 * useful for inverting entire color palettes with multiple color families.
 *
 * @template T - Nested object type containing color scales
 *
 * @example
 * ```typescript
 * type Colors = {
 *   blue: { 50: '#eff6ff', 500: '#3b82f6', 950: '#172554' },
 *   gray: { 50: '#f9fafb', 500: '#6b7280', 950: '#030712' }
 * }
 *
 * type InvertedColors = DeepInvertColorScale<Colors>
 * // Inverts all nested color scales
 * ```
 */
export type DeepInvertColorScale<T extends object> =
    T extends Record<number, string>
        ? InvertColorScale<T>
        : T extends Record<string, object>
          ? {
                [K in keyof T]: DeepInvertColorScale<T[K]>
            }
          : never
