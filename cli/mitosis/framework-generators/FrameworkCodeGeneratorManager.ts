import { AngularGenerator } from './AngularGenerator.ts'
import { ReactGenerator } from './ReactGenerator.ts'
import { SvelteGenerator } from './SvelteGenerator.ts'
import { VueGenerator } from './VueGenerator.ts'

import type { FrameworkGenerator, GenerationContext, GenerationResult } from './types.ts'

/**
 * Manages framework-specific code generators
 * Uses strategy pattern to delegate to appropriate framework generator
 */
export class FrameworkCodeGeneratorManager {
    private generators: FrameworkGenerator[]

    constructor() {
        // Order matters - Vue and Svelte should be checked first as they have more specific patterns
        this.generators = [
            new VueGenerator(),
            new SvelteGenerator(),
            new AngularGenerator(),
            new ReactGenerator(), // React is the fallback as it has the most generic patterns
        ]
    }

    /**
     * Generate framework-specific code by delegating to appropriate generator
     */
    generate(context: GenerationContext): GenerationResult {
        // Find the first generator that can handle this code
        for (const generator of this.generators) {
            if (generator.canHandle(context.code)) {
                return generator.generate(context)
            }
        }

        // Fallback: return code unchanged if no generator matches
        return { code: context.code }
    }
}
