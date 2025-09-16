import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface JSXElement {
  type: 'element' | 'fragment' | 'text' | 'component'
  tag?: string
  props?: Record<string, any>
  children?: JSXElement[]
  text?: string
}

/**
 * Compile-time JSX to Svelte compiler
 * Transforms JSX/TSX files into clean Svelte components
 */
export class JSXToSvelteCompiler {

  /**
   * Parse JSX string to AST-like structure
   */
  parseJSX(jsxCode: string): JSXElement {
    // Simple regex-based parser for demo
    // In production, use proper AST parser like @babel/parser

    // Handle fragments first
    jsxCode = jsxCode.replace(/<>\s*(.*?)\s*<\/>/gs, (match, content) => {
      return `<Fragment>${content}</Fragment>`
    })

    // Handle self-closing tags
    jsxCode = jsxCode.replace(/<(\w+)([^>]*?)\/>/g, '<$1$2></$1>')

    return this.parseElement(jsxCode)
  }

  private parseElement(code: string): JSXElement {
    // Simplified parsing - in real implementation use proper AST
    if (!code.includes('<')) {
      return { type: 'text', text: code.trim() }
    }

    const tagMatch = code.match(/<(\w+)([^>]*?)>(.*?)<\/\1>/s)
    if (!tagMatch) {
      return { type: 'text', text: code }
    }

    const [, tag, propsStr, content] = tagMatch
    const props = this.parseProps(propsStr)
    const children = this.parseChildren(content)

    if (tag === 'Fragment') {
      return { type: 'fragment', children }
    }

    return {
      type: tag[0] === tag[0].toUpperCase() ? 'component' : 'element',
      tag: tag.toLowerCase(),
      props,
      children
    }
  }

  private parseProps(propsStr: string): Record<string, any> {
    const props: Record<string, any> = {}
    const matches = propsStr.matchAll(/(\w+)=["']([^"']+)["']/g)

    for (const match of matches) {
      const [, key, value] = match
      props[key === 'className' ? 'class' : key] = value
    }

    return props
  }

  private parseChildren(content: string): JSXElement[] {
    const children: JSXElement[] = []

    // Split by tags but keep them
    const parts = content.split(/(<[^>]+>.*?<\/[^>]+>)/s)

    for (const part of parts) {
      if (part.trim()) {
        if (part.startsWith('<')) {
          children.push(this.parseElement(part))
        } else {
          children.push({ type: 'text', text: part.trim() })
        }
      }
    }

    return children
  }

  /**
   * Convert JSX AST to clean Svelte template
   */
  generateSvelte(element: JSXElement): string {
    switch (element.type) {
      case 'text':
        return element.text || ''

      case 'fragment':
        // Fragment becomes just its children - no wrapper!
        return element.children?.map(child => this.generateSvelte(child)).join('') || ''

      case 'element':
        const props = this.formatProps(element.props)
        const children = element.children?.map(child => this.generateSvelte(child)).join('') || ''

        if (children) {
          return `<${element.tag}${props}>${children}</${element.tag}>`
        } else {
          return `<${element.tag}${props} />`
        }

      case 'component':
        // For now, treat components as elements
        const compProps = this.formatProps(element.props)
        const compChildren = element.children?.map(child => this.generateSvelte(child)).join('') || ''

        if (compChildren) {
          return `<${element.tag}${compProps}>${compChildren}</${element.tag}>`
        } else {
          return `<${element.tag}${compProps} />`
        }

      default:
        return ''
    }
  }

  private formatProps(props?: Record<string, any>): string {
    if (!props || Object.keys(props).length === 0) return ''

    return ' ' + Object.entries(props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
  }

  /**
   * Compile TSX file to Svelte component
   */
  compileTSXFile(tsxPath: string, outputPath: string): void {
    const tsxContent = readFileSync(tsxPath, 'utf-8')

    // Extract JSX from return statement
    const returnMatch = tsxContent.match(/return\s*\(\s*([\s\S]*?)\s*\)/m)
    if (!returnMatch) {
      throw new Error('No return statement found in TSX file')
    }

    const jsxCode = returnMatch[1].trim()
    const ast = this.parseJSX(jsxCode)
    const svelteTemplate = this.generateSvelte(ast)

    // Generate complete Svelte file
    const svelteContent = `<!-- Auto-generated from ${tsxPath} -->
<script lang="ts">
  // Component logic here
</script>

${svelteTemplate}

<style>
  .boo {
    /* Add styles */
  }
</style>`

    writeFileSync(outputPath, svelteContent)
    console.log(`✅ Compiled ${tsxPath} → ${outputPath}`)
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const compiler = new JSXToSvelteCompiler()
  const tsxFile = process.argv[2]
  const svelteFile = process.argv[3] || tsxFile.replace('.tsx', '.svelte')

  if (tsxFile) {
    compiler.compileTSXFile(tsxFile, svelteFile)
  } else {
    console.log('Usage: tsx jsx-to-svelte-compiler.ts input.tsx [output.svelte]')
  }
}

export default JSXToSvelteCompiler