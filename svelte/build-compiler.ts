import { readFileSync, writeFileSync } from 'fs'

/**
 * Build-time JSX to Svelte compiler
 * Transforms JSX into clean Svelte templates with zero runtime overhead
 */

interface JSXNode {
  type: 'element' | 'fragment' | 'text' | 'component'
  tag?: string
  props?: Record<string, any>
  children?: JSXNode[]
  content?: string
}

export class BuildTimeCompiler {

  /**
   * Parse JSX/TSX content and extract JSX from return statements
   */
  extractJSXFromTSX(tsxContent: string): string[] {
    const jsxBlocks: string[] = []

    // Find all return statements with JSX
    const returnPattern = /return\s*\(\s*([\s\S]*?)\s*\)(?:\s*[;}])/g
    let match

    while ((match = returnPattern.exec(tsxContent)) !== null) {
      jsxBlocks.push(match[1].trim())
    }

    return jsxBlocks
  }

  /**
   * Convert JSX string to clean Svelte template
   */
  jsxToSvelte(jsx: string): string {
    // Replace React Fragment syntax
    jsx = jsx.replace(/<>\s*([\s\S]*?)\s*<\/>/g, '$1')

    // Replace className with class
    jsx = jsx.replace(/className=/g, 'class=')

    // Convert self-closing tags to proper format
    jsx = jsx.replace(/(<\w+[^>]*?)\/>/g, '$1></$1>')
    jsx = jsx.replace(/><\/([^>]+)>/g, ' />')
    jsx = jsx.replace(/><\/([^>]+) \/>/g, '></$1>')

    // Clean up whitespace
    jsx = jsx.replace(/\s+/g, ' ')
    jsx = jsx.replace(/>\s+</g, '><')

    return jsx.trim()
  }

  /**
   * Generate complete Svelte component
   */
  generateSvelteComponent(template: string, componentName: string): string {
    return `<!-- Auto-compiled from ${componentName}.tsx -->
<script lang="ts">
  // Pure Svelte - zero runtime JSX overhead
  export let props: any = {};
</script>

${template}

<style>
  /* Add component styles here */
  :global(.Boo) {
    padding: 1rem;
    border: 2px solid #42b883;
    border-radius: 8px;
    margin: 1rem 0;
  }
</style>`
  }

  /**
   * Compile TSX file to optimized Svelte
   */
  async compile(tsxPath: string, outputPath: string): Promise<void> {
    try {
      const tsxContent = readFileSync(tsxPath, 'utf-8')
      const jsxBlocks = this.extractJSXFromTSX(tsxContent)

      if (jsxBlocks.length === 0) {
        throw new Error('No JSX found in TSX file')
      }

      // Use the first JSX block (main component)
      const mainJSX = jsxBlocks[0]
      const svelteTemplate = this.jsxToSvelte(mainJSX)
      const componentName = tsxPath.split('/').pop()?.replace('.tsx', '') || 'Component'

      const svelteComponent = this.generateSvelteComponent(svelteTemplate, componentName)

      writeFileSync(outputPath, svelteComponent)

      console.log(`✅ Compiled ${tsxPath} → ${outputPath}`)
      console.log(`📦 Template: ${svelteTemplate}`)

    } catch (error) {
      console.error(`❌ Error compiling ${tsxPath}:`, error)
    }
  }
}

// Example usage and testing
export function testCompiler(): void {
  const compiler = new BuildTimeCompiler()

  // Test with your Foo.tsx content
  const testJSX = `
    <div className="Boo">
      <a href="https://google.com">Google</a>
      <>
        <div>123</div>
        <span>span</span>
      </>
    </div>
  `

  const result = compiler.jsxToSvelte(testJSX)
  console.log('Compiled result:')
  console.log(result)

  const fullComponent = compiler.generateSvelteComponent(result, 'Foo')
  console.log('\nFull Svelte component:')
  console.log(fullComponent)
}

// Run test
testCompiler()

export default BuildTimeCompiler