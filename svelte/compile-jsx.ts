/**
 * Simple JSX to Svelte compiler for your specific case
 */

export function compileFooTSX(): string {
  // Your JSX structure from Foo.tsx
  const jsxStructure = {
    type: 'element',
    tag: 'div',
    props: { class: 'Boo' },
    children: [
      {
        type: 'element',
        tag: 'a',
        props: { href: 'https://google.com' },
        children: [{ type: 'text', text: 'Google' }]
      },
      {
        type: 'fragment',
        children: [
          {
            type: 'element',
            tag: 'div',
            children: [{ type: 'text', text: '123' }]
          },
          {
            type: 'element',
            tag: 'span',
            children: [{ type: 'text', text: 'span' }]
          }
        ]
      }
    ]
  }

  return generateCleanSvelte(jsxStructure)
}

function generateCleanSvelte(node: any): string {
  switch (node.type) {
    case 'text':
      return node.text

    case 'fragment':
      // Fragment just renders children directly - no wrapper
      return node.children.map((child: any) => generateCleanSvelte(child)).join('')

    case 'element':
      const props = node.props
        ? ' ' + Object.entries(node.props).map(([k, v]) => `${k}="${v}"`).join(' ')
        : ''

      const children = node.children
        ? node.children.map((child: any) => generateCleanSvelte(child)).join('')
        : ''

      if (children) {
        return `<${node.tag}${props}>${children}</${node.tag}>`
      } else {
        return `<${node.tag}${props} />`
      }

    default:
      return ''
  }
}

// Generate the actual Svelte template
export const FooSvelteTemplate = compileFooTSX()

// Create a clean Svelte component string
export function createSvelteComponent(template: string): string {
  return `<script lang="ts">
  // Compiled from JSX
</script>

${template}

<style>
  .Boo {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .Boo a {
    color: #42b883;
    text-decoration: none;
  }

  .Boo a:hover {
    text-decoration: underline;
  }
</style>`
}

console.log('Generated Svelte template:')
console.log(FooSvelteTemplate)
console.log('\nFull component:')
console.log(createSvelteComponent(FooSvelteTemplate))