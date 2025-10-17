import type { Brand } from '../types/brand'

// Utility function
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// Generate Tailwind CSS v4 plugin with separate matchUtilities blocks
export function generateTailwindConfig(brand: Brand): string {
    let pluginCode = `export default function brandPlugin({ matchUtilities }: { matchUtilities: any }) {`

    // Background utilities
    pluginCode += `
  // Background utilities
  matchUtilities(
    {
      'bg': (value: string) => ({
        backgroundColor: value,
      }),
    },
    {
      values: {`

    const bgValues: string[] = []
    // Foundation colors
    if (brand.foundation?.colors) {
        Object.entries(brand.foundation.colors).forEach(([colorName, colorScale]) => {
            if (typeof colorScale === 'object' && colorScale !== null) {
                Object.entries(colorScale as Record<string, string>).forEach(([shade, value]) => {
                    if (typeof value === 'string') {
                        bgValues.push(`        '${camelToKebab(colorName)}-${shade}': '${value}',`)
                    }
                })
            }
        })
    }
    // Background semantic colors
    if (brand.semantic?.colors?.background) {
        Object.entries(brand.semantic.colors.background).forEach(([colorName, value]) => {
            bgValues.push(`        '${camelToKebab(colorName)}': '${value}',`)
        })
    }
    if (brand.semantic?.colors?.surface) {
        Object.entries(brand.semantic.colors.surface).forEach(([colorName, value]) => {
            bgValues.push(`        'surface-${camelToKebab(colorName)}': '${value}',`)
        })
    }
    // Other semantic groups for bg
    if (brand.semantic?.colors) {
        ['brand', 'status', 'effects'].forEach(groupName => {
            if (brand.semantic.colors[groupName]) {
                Object.entries(brand.semantic.colors[groupName]).forEach(([colorName, value]) => {
                    bgValues.push(`        '${camelToKebab(groupName)}-${camelToKebab(colorName)}': '${value}',`)
                })
            }
        })
    }

    pluginCode += bgValues.join('\n')
    pluginCode += `
      }
    }
  )

  // Text utilities
  matchUtilities(
    {
      'text': (value: string) => ({
        color: value,
      }),
    },
    {
      values: {`

    const textValues: string[] = []
    // Foundation colors
    if (brand.foundation?.colors) {
        Object.entries(brand.foundation.colors).forEach(([colorName, colorScale]) => {
            if (typeof colorScale === 'object' && colorScale !== null) {
                Object.entries(colorScale as Record<string, string>).forEach(([shade, value]) => {
                    if (typeof value === 'string') {
                        textValues.push(`        '${camelToKebab(colorName)}-${shade}': '${value}',`)
                    }
                })
            }
        })
    }
    // Foreground semantic colors
    if (brand.semantic?.colors?.foreground) {
        Object.entries(brand.semantic.colors.foreground).forEach(([colorName, value]) => {
            textValues.push(`        '${camelToKebab(colorName)}': '${value}',`)
        })
    }
    // Other semantic groups for text
    if (brand.semantic?.colors) {
        ['brand', 'status', 'effects'].forEach(groupName => {
            if (brand.semantic.colors[groupName]) {
                Object.entries(brand.semantic.colors[groupName]).forEach(([colorName, value]) => {
                    textValues.push(`        '${camelToKebab(groupName)}-${camelToKebab(colorName)}': '${value}',`)
                })
            }
        })
    }

    pluginCode += textValues.join('\n')
    pluginCode += `
      }
    }
  )

  // Border utilities
  matchUtilities(
    {
      'border': (value: string) => ({
        borderColor: value,
      }),
    },
    {
      values: {`

    const borderValues: string[] = []
    // Foundation colors
    if (brand.foundation?.colors) {
        Object.entries(brand.foundation.colors).forEach(([colorName, colorScale]) => {
            if (typeof colorScale === 'object' && colorScale !== null) {
                Object.entries(colorScale as Record<string, string>).forEach(([shade, value]) => {
                    if (typeof value === 'string') {
                        borderValues.push(`        '${camelToKebab(colorName)}-${shade}': '${value}',`)
                    }
                })
            }
        })
    }
    // Border semantic colors
    if (brand.semantic?.colors?.border) {
        Object.entries(brand.semantic.colors.border).forEach(([colorName, value]) => {
            borderValues.push(`        '${camelToKebab(colorName)}': '${value}',`)
        })
    }
    // Other semantic groups for border
    if (brand.semantic?.colors) {
        ['brand', 'status', 'effects'].forEach(groupName => {
            if (brand.semantic.colors[groupName]) {
                Object.entries(brand.semantic.colors[groupName]).forEach(([colorName, value]) => {
                    borderValues.push(`        '${camelToKebab(groupName)}-${camelToKebab(colorName)}': '${value}',`)
                })
            }
        })
    }

    pluginCode += borderValues.join('\n')
    pluginCode += `
      }
    }
  )

  // Spacing utilities
  matchUtilities(
    {
      'p': (value: string) => ({
        padding: value,
      }),
      'm': (value: string) => ({
        margin: value,
      }),
      'gap': (value: string) => ({
        gap: value,
      }),
    },
    {
      values: {`

    const spacingValues: string[] = []
    // Add spacing values
    if (brand.foundation?.spacing) {
        Object.entries(brand.foundation.spacing).forEach(([size, value]) => {
            spacingValues.push(`        '${size}': '${value}',`)
        })
    }

    pluginCode += spacingValues.join('\n')
    pluginCode += `
      }
    }
  )

  // Font size utilities
  matchUtilities(
    {
      'text-size': (value: string) => ({
        fontSize: value,
      }),
    },
    {
      values: {`

    const fontSizeValues: string[] = []
    // Add font size values
    if (brand.foundation?.typography?.fontSize) {
        Object.entries(brand.foundation.typography.fontSize).forEach(([size, value]) => {
            const [fontSize] = Array.isArray(value) ? value : [value]
            fontSizeValues.push(`        '${size}': '${fontSize}',`)
        })
    }

    pluginCode += fontSizeValues.join('\n')
    pluginCode += `
      }
    }
  )

  // Radius utilities
  matchUtilities(
    {
      'rounded': (value: string) => ({
        borderRadius: value,
      }),
    },
    {
      values: {`

    const radiusValues: string[] = []
    // Add foundation radius values
    if (brand.foundation?.radius) {
        Object.entries(brand.foundation.radius).forEach(([size, value]) => {
            radiusValues.push(`        '${size}': '${value}',`)
        })
    }

    // Add semantic radius values
    if (brand.semantic?.radius) {
        Object.entries(brand.semantic.radius).forEach(([name, value]) => {
            radiusValues.push(`        '${camelToKebab(name)}': '${value}',`)
        })
    }

    pluginCode += radiusValues.join('\n')
    pluginCode += `
      }
    }
  )

  // Shadow utilities
  matchUtilities(
    {
      'shadow': (value: string) => ({
        boxShadow: value,
      }),
    },
    {
      values: {`

    const shadowValues: string[] = []
    // Add shadow values
    if (brand.foundation?.boxShadow) {
        Object.entries(brand.foundation.boxShadow).forEach(([size, value]) => {
            shadowValues.push(`        '${size}': '${value}',`)
        })
    }

    pluginCode += shadowValues.join('\n')
    pluginCode += `
      }
    }
  )

  // Effect utilities (glow, filter)
  matchUtilities(
    {
      'glow': (value: string) => ({
        filter: \`drop-shadow(\${value})\`,
      }),
    },
    {
      values: {`

    const glowValues: string[] = []
    // Add glow values from foundation
    if (brand.foundation?.glow) {
        Object.entries(brand.foundation.glow).forEach(([size, value]) => {
            glowValues.push(`        '${size}': '${value}',`)
        })
    }

    // Add glow values from semantic effects
    if (brand.semantic?.colors?.effects) {
        Object.entries(brand.semantic.colors.effects).forEach(([effectName, value]) => {
            if (effectName.includes('glow')) {
                const name = effectName.replace('glow', '').toLowerCase()
                glowValues.push(`        '${name}': '${value}',`)
            }
        })
    }

    pluginCode += glowValues.join('\n')
    pluginCode += `
      }
    }
  )
}`

    return pluginCode
}