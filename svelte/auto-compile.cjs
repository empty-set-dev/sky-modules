#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Auto-compile JSX/TSX to clean Svelte components
 * Usage: node auto-compile.js input.tsx [output.svelte]
 */

function compileJSXToSvelte(jsxContent) {
  // Extract JSX from return statement
  const returnMatch = jsxContent.match(/return\s*\(\s*([\s\S]*?)\s*\)/m)
  if (!returnMatch) {
    throw new Error('No return statement found')
  }

  let jsx = returnMatch[1].trim()

  // Transform JSX to Svelte
  jsx = jsx
    // Replace React fragments
    .replace(/<>\s*([\s\S]*?)\s*<\/>/g, '$1')
    // Replace className with class
    .replace(/className=/g, 'class=')
    // Clean whitespace
    .replace(/\s+/g, ' ')
    .replace(/>\s*</g, '>\n    <')
    .trim()

  return jsx
}

function generateSvelteComponent(template, componentName) {
  return `<!-- Auto-compiled from ${componentName}.tsx - No runtime JSX -->
<script lang="ts">
  export let props: any = {};
</script>

${template}

<style>
  /* Component styles */
</style>`
}

function main() {
  const inputFile = process.argv[2]
  const outputFile = process.argv[3] || inputFile?.replace(/\.tsx?$/, '.svelte')

  if (!inputFile) {
    console.log('Usage: node auto-compile.js input.tsx [output.svelte]')
    process.exit(1)
  }

  try {
    const tsxContent = fs.readFileSync(inputFile, 'utf-8')
    const svelteTemplate = compileJSXToSvelte(tsxContent)
    const componentName = path.basename(inputFile, path.extname(inputFile))
    const svelteComponent = generateSvelteComponent(svelteTemplate, componentName)

    fs.writeFileSync(outputFile, svelteComponent)

    console.log(`✅ Compiled ${inputFile} → ${outputFile}`)
    console.log(`📦 Generated clean Svelte with NO runtime overhead!`)
    console.log('\nTemplate preview:')
    console.log(svelteTemplate)

  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { compileJSXToSvelte, generateSvelteComponent }