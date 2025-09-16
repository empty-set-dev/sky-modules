/**
 * Simple test of JSX to Svelte conversion
 */

function jsxToSvelte(jsx) {
  // Replace React Fragment syntax with direct children
  jsx = jsx.replace(/<>\s*([\s\S]*?)\s*<\/>/g, '$1')

  // Replace className with class
  jsx = jsx.replace(/className=/g, 'class=')

  // Clean up whitespace but preserve structure
  jsx = jsx.replace(/\s+/g, ' ')
  jsx = jsx.replace(/>\s+</g, '>\n  <')
  jsx = jsx.replace(/^\s+|\s+$/g, '')

  return jsx
}

// Test with your Foo.tsx content
const testJSX = `<div className="Boo">
      <a href="https://google.com">Google</a>

      <>
          <div>123</div>
          <span>span</span>
      </>
  </div>`

console.log('Original JSX:')
console.log(testJSX)
console.log('\n' + '='.repeat(50) + '\n')

const converted = jsxToSvelte(testJSX)
console.log('Converted Svelte:')
console.log(converted)

console.log('\n' + '='.repeat(50) + '\n')

const fullComponent = `<!-- Compiled from Foo.tsx - ZERO runtime overhead -->
<script lang="ts">
  // Pure Svelte component
</script>

${converted}

<style>
  .Boo {
    padding: 1rem;
    border: 2px solid #42b883;
    border-radius: 8px;
    margin: 1rem 0;
  }

  .Boo a {
    color: #42b883;
    text-decoration: none;
  }

  .Boo a:hover {
    text-decoration: underline;
  }
</style>`

console.log('Complete Svelte Component:')
console.log(fullComponent)