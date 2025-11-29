import type { FrameworkGenerator, GenerationContext, GenerationResult } from './types.ts'

/**
 * Svelte code generator
 * Handles script tag patterns with export let and reactive statements
 */
export class SvelteGenerator implements FrameworkGenerator {
    canHandle(code: string): boolean {
        return (
            code.includes("<script lang='ts'>") ||
            code.includes('<script lang="ts">') ||
            code.includes('<script context=')
        )
    }

    generate(context: GenerationContext): GenerationResult {
        let { code, missingVars, globalImports, generics } = context

        // Add global imports at the beginning (before script tag)
        if (globalImports.length > 0) {
            const globalImportsStr = globalImports.join('\n') + '\n\n'
            code = globalImportsStr + code
        }

        // Add generics to Svelte component script if detected
        if (generics) {
            // In Svelte, generics are added to the script tag
            code = code
                .replace(
                    /<script lang="ts">/g,
                    `<script lang="ts" generics="${generics.slice(1, -1)}">`
                )
                .replace(
                    /<script lang='ts'>/g,
                    `<script lang='ts' generics='${generics.slice(1, -1)}'>`
                )
        }

        if (missingVars.length === 0) {
            return { code }
        }

        // Add variable declarations to Svelte script
        const svelteDeclarations = missingVars
            .map(v => {
                if (v.isRest) {
                    // Create reactive statement for rest props
                    return `  $: ${v.name} = (() => {
    const { ${v.omittedKeys}, ...rest } = $$props;
    return rest;
  })();`
                }

                return `  export let ${v.name}: any = undefined;`
            })
            .join('\n')

        // Find the last import or insert at beginning of script
        const scriptMatch = code.match(
            /(<script lang=['"]ts['"][^>]*>)([\s\S]*?)(\n\s*)([\s\S]*?<\/script>)/
        )

        if (scriptMatch) {
            const beforeScript = code.substring(0, code.indexOf(scriptMatch[0]))
            const afterScript = code.substring(code.indexOf(scriptMatch[0]) + scriptMatch[0].length)

            // Find last import or first non-import line
            const scriptContent = scriptMatch[2]
            const lines = scriptContent.split('\n')
            let insertIndex = 0

            for (let i = lines.length - 1; i >= 0; i--) {
                if (lines[i].trim().startsWith('import ')) {
                    insertIndex = i + 1
                    break
                }
            }

            // Insert variable declarations
            lines.splice(insertIndex, 0, '', svelteDeclarations)

            code =
                beforeScript +
                scriptMatch[1] +
                lines.join('\n') +
                scriptMatch[3] +
                scriptMatch[4] +
                afterScript
        }

        return { code }
    }
}
