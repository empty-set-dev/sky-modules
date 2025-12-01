/**
 * Layout system configuration
 *
 * Defines container behavior, sizing, and responsive padding across breakpoints.
 *
 * @example
 * ```typescript
 * const layout: BrandLayout = {
 *   container: {
 *     center: true,
 *     padding: {
 *       default: '1rem',
 *       md: '2rem',
 *       lg: '4rem'
 *     },
 *     maxWidth: {
 *       sm: '640px',
 *       md: '768px',
 *       lg: '1024px',
 *       xl: '1280px'
 *     }
 *   }
 * }
 * ```
 */
export default interface BrandLayout {
    container: {
        center: boolean
        padding: {
            default: string
            xs: string
            sm: string
            md: string
            lg: string
            xl: string
            '2xl': string
            '3xl': string
        }
        maxWidth: {
            xs: string
            sm: string
            md: string
            lg: string
            xl: string
            '2xl': string
            '3xl': string
            '4xl': string
            '5xl': string
            '6xl': string
            '7xl': string
            '8xl': string
            '9xl': string
        }
    }
}
