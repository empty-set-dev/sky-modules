import BrandNamespace from '.'

import type DeepPartial from '@sky-modules/core/utility-types/DeepPartial'

/**
 * Complete brand definition with all design tokens
 *
 * Defines a comprehensive design system including foundation tokens,
 * semantic tokens, layout configuration, component styles, and theme palettes.
 *
 * @example
 * ```typescript
 * const skyBrand: Brand = {
 *   name: 'sky',
 *   foundation: {
 *     colors: { blue: { 50: '#eff6ff', ... } },
 *     typography: { ... },
 *     spacing: { xs: '0.25rem', ... }
 *   },
 *   semantic: {
 *     colors: { primary: 'blue.500', ... }
 *   },
 *   layout: {
 *     container: { ... }
 *   }
 * }
 * ```
 */
export default interface Brand {
    /**
     * Brand name for data-brand attribute
     *
     * Used to identify the brand in HTML attributes and CSS selectors
     *
     * @example 'sky', 'custom', 'acme'
     */
    name: string

    /**
     * Base brand(s) to extend from
     *
     * Allows brand inheritance and composition
     *
     * @example
     * ```typescript
     * extends: [baseBrand, customizations]
     * ```
     */
    extends?: BrandNamespace.Description[]

    /**
     * Foundation - atomic design tokens
     *
     * Core visual primitives: colors, typography, spacing, shadows, borders
     */
    foundation: BrandNamespace.Foundation

    /**
     * Semantic tokens - role-based tokens
     *
     * Purpose-driven tokens referencing foundation tokens
     */
    semantic: BrandNamespace.Semantic

    /**
     * Layout system configuration
     *
     * Container sizes, breakpoints, and layout constraints
     */
    layout: BrandNamespace.Layout

    /**
     * Component tokens - component-specific styles
     *
     * Style definitions for all UI components
     */
    components?: BrandNamespace.Components

    /**
     * Data visualization tokens
     *
     * Color palettes and styling for charts and graphs
     */
    charts?: BrandNamespace.Charts

    /**
     * Theme palettes (light, dark, high-contrast, etc.)
     *
     * Multiple color schemes for the same brand
     *
     * @example
     * ```typescript
     * palettes: {
     *   light: { ... },
     *   dark: { ... },
     *   highContrast: { ... }
     * }
     * ```
     */
    palettes?: Record<string, BrandNamespace.Palette>
}

/**
 * Partial brand definition for extending or customizing existing brands
 *
 * All fields except name are optional, allowing selective overrides
 *
 * @example
 * ```typescript
 * const customBrand: BrandDescription = {
 *   name: 'custom',
 *   extends: [skyBrand],
 *   foundation: {
 *     colors: {
 *       blue: { 500: '#0066cc' } // Override specific color
 *     }
 *   }
 * }
 * ```
 */
export interface BrandDescription extends DeepPartial<Brand> {
    /**
     * Brand name (required even in partial descriptions)
     */
    name: string
}
