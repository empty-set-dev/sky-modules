/**
 * Types for framework-specific code generation
 */

export interface ExtractedVariable {
    name: string
    value: string
    line: number
    isRest?: boolean
    omittedKeys?: string
    sourceValue?: string
}

export interface GenerationContext {
    code: string
    missingVars: ExtractedVariable[]
    globalImports: string[]
    generics: string | null
    componentName: string
}

export interface GenerationResult {
    code: string
}

/**
 * Framework-specific code generator interface
 */
export interface FrameworkGenerator {
    /**
     * Detect if this generator handles the given code
     */
    canHandle(code: string): boolean

    /**
     * Generate framework-specific code with variable declarations
     */
    generate(context: GenerationContext): GenerationResult
}
