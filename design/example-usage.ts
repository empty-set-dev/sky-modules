// 🎨 Example Usage - Brand CSS Generator
import cyberpunkBrand from '../examples/universal/sky.brand'
import { generateBrandCSS, generateFoundationCSS, generateSemanticCSS } from '@sky-modules/cli/utilities/generateCSS'
import fs from 'fs'
// Example 1: Generate full Brand CSS with default settings
console.log('=== Full Brand CSS (Default) ===')
const fullCSS = generateBrandCSS(cyberpunkBrand)
console.log(`Generated ${fullCSS.stats.variableCount} CSS variables`)
console.log(`Output size: ${fullCSS.stats.bytes} bytes`)
console.log('\nFirst 500 characters:')
console.log(fullCSS.css.substring(0, 500) + '...')
fs.writeFileSync('example-brand.css', fullCSS.css)
// Example 2: Generate minified CSS
console.log('\n\n=== Minified CSS ===')
const minifiedCSS = generateBrandCSS(cyberpunkBrand, {
    minify: true,
    includeComments: false,
})
console.log(`Minified size: ${minifiedCSS.stats.bytes} bytes`)
console.log('First 200 characters:')
console.log(minifiedCSS.css.substring(0, 200) + '...')

// Example 3: Generate CSS with custom theme name
console.log('\n\n=== Themed CSS ===')
const themedCSS = generateBrandCSS(cyberpunkBrand, {
    themeName: 'cyberpunk',
    includeComments: true,
})
console.log('First 300 characters:')
console.log(themedCSS.css.substring(0, 300) + '...')

// Example 4: Generate CSS with utility classes
console.log('\n\n=== CSS with Utility Classes ===')
const utilityCSS = generateBrandCSS(cyberpunkBrand, {
    generateClasses: true,
    includeComments: false,
})
console.log(
    `Generated ${utilityCSS.stats.variableCount} variables and ${utilityCSS.stats.classCount} utility classes`
)
console.log(`Total size: ${utilityCSS.stats.bytes} bytes`)

// Example 5: Generate only Foundation CSS
console.log('\n\n=== Foundation Only ===')
const foundationOnlyCSS = generateFoundationCSS(cyberpunkBrand.foundation, {
    includeComments: true,
    prefix: '--foundation-',
})
console.log('Foundation CSS (first 400 characters):')
console.log(foundationOnlyCSS.substring(0, 400) + '...')

// Example 6: Generate only Semantic CSS
console.log('\n\n=== Semantic Only ===')
const semanticOnlyCSS = generateSemanticCSS(cyberpunkBrand.semantic, {
    includeComments: true,
    prefix: '--semantic-',
})
console.log('Semantic CSS (first 400 characters):')
console.log(semanticOnlyCSS.substring(0, 400) + '...')

// Example 7: Generate CSS for multiple themes
console.log('\n\n=== Multiple Themes ===')
const lightThemeCSS = generateBrandCSS(cyberpunkBrand, {
    themeName: 'light',
    selector: '[data-theme="light"]',
})

const darkThemeCSS = generateBrandCSS(cyberpunkBrand, {
    themeName: 'dark',
    selector: '[data-theme="dark"]',
})

console.log('Light theme CSS (first 200 characters):')
console.log(lightThemeCSS.css.substring(0, 200) + '...')
console.log('\nDark theme CSS (first 200 characters):')
console.log(darkThemeCSS.css.substring(0, 200) + '...')

// Example 8: Save CSS to files (example - would need file system)
/*
import { writeFileSync } from 'fs'

// Save full CSS
writeFileSync('cyberpunk-theme.css', fullCSS.css)

// Save minified CSS
writeFileSync('cyberpunk-theme.min.css', minifiedCSS.css)

// Save utility classes
writeFileSync('cyberpunk-utilities.css', utilityCSS.classes || '')

console.log('CSS files saved!')
*/

// Example 9: Configuration for different environments
const developmentConfig = {
    includeComments: true,
    generateClasses: true,
    minify: false,
}

const productionConfig = {
    includeComments: false,
    generateClasses: false,
    minify: true,
}

console.log('\n\n=== Development vs Production ===')
const devCSS = generateBrandCSS(cyberpunkBrand, developmentConfig)
const prodCSS = generateBrandCSS(cyberpunkBrand, productionConfig)

console.log(`Development: ${devCSS.stats.bytes} bytes, ${devCSS.stats.variableCount} variables`)
console.log(`Production: ${prodCSS.stats.bytes} bytes, ${prodCSS.stats.variableCount} variables`)
console.log(`Size reduction: ${Math.round((1 - prodCSS.stats.bytes / devCSS.stats.bytes) * 100)}%`)

// Example 10: Advanced theming system
function generateThemeSystem(baseBrand: typeof cyberpunkBrand, themes: string[]) {
    const css = themes
        .map(theme => {
            return generateBrandCSS(baseBrand, {
                themeName: theme,
                selector: `[data-theme="${theme}"]`,
                includeComments: false,
                minify: true,
            }).css
        })
        .join('\n\n')

    return css
}

const multiThemeCSS = generateThemeSystem(cyberpunkBrand, ['light', 'dark', 'cyberpunk', 'neon'])
console.log('\n\n=== Multi-Theme System ===')
console.log(`Generated CSS for 4 themes: ${multiThemeCSS.length} bytes`)
console.log('First 300 characters:')
console.log(multiThemeCSS.substring(0, 300) + '...')

export { fullCSS, minifiedCSS, themedCSS, utilityCSS, developmentConfig, productionConfig }
