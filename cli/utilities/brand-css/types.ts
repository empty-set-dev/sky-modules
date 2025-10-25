import Brand from '@sky-modules/design/Brand'

// Configuration interface for CSS generation
export interface BrandCssGeneratorConfig {
    prefix?: string // CSS variable prefix (default: '--')
    selector?: string // CSS selector (default: ':root')
    includeComments?: boolean // Include comments in output
    brandName?: string // Brand name for data-brand scoping (e.g., 'sky', 'custom')
    minify?: boolean // Minify output
    generateUtilities?: boolean // Generate utility classes
    utilityPrefix?: string // Utility class prefix (default: 'brand-')
}

// CSS generation result
export interface BrandCssGenerationResult {
    css: string
    variables: Record<string, string>
    utilities: Record<string, string>
    pandaConfig: Record<string, unknown>
    tailwindConfig: string
    stats: {
        variableCount: number
        utilityCount: number
        bytes: number
    }
}

// Default configuration
export const defaultConfig: Required<BrandCssGeneratorConfig> = {
    prefix: '--',
    selector: ':root',
    includeComments: true,
    brandName: '',
    minify: false,
    generateUtilities: true,
    utilityPrefix: 'brand-',
}

// Token value types for type-safe wrapTokenValues
export type TokenPrimitive = string | number | boolean | null
export type TokenObject = TokenPrimitive | { [key: string]: TokenObject }
export type WrappedToken<T> = T extends TokenPrimitive
    ? { value: T }
    : T extends { [key: string]: infer V }
      ? { [K in keyof T]: WrappedToken<T[K]> }
      : never

// CSS generation context passed between functions
export interface GenerationContext {
    config: Required<BrandCssGeneratorConfig>
    foundation: Brand['foundation']
}

// Result from individual generator functions
export interface GeneratorResult {
    css: string
    utilities: string
}
