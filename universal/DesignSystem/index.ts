import type {
    ColorPalette,
    ColorScale,
    ThemeConfig,
    SemanticColors
} from './ColorPalette'
import type {
    DesignSystemSync,
    ColorConverter,
    PaletteGenerator
} from './DesignSystemSync'

/**
 * Main design system implementation for Sky Modules
 */
export class UniversalDesignSystem implements DesignSystemSync, ColorConverter, PaletteGenerator {

    /**
     * Generate Tailwind CSS configuration from design system palette
     */
    generateTailwindConfig(palette: ColorPalette): Record<string, unknown> {
        return {
            theme: {
                extend: {
                    colors: {
                        primary: this.colorScaleToTailwind(palette.primary),
                        secondary: this.colorScaleToTailwind(palette.secondary),
                        accent: this.colorScaleToTailwind(palette.accent),
                        neutral: this.colorScaleToTailwind(palette.neutral),
                        success: this.colorScaleToTailwind(palette.success),
                        warning: this.colorScaleToTailwind(palette.warning),
                        error: this.colorScaleToTailwind(palette.error),
                        info: this.colorScaleToTailwind(palette.info),
                    }
                }
            }
        }
    }

    /**
     * Generate Panda CSS configuration from design system palette
     */
    generatePandaConfig(palette: ColorPalette): Record<string, unknown> {
        return {
            theme: {
                tokens: {
                    colors: {
                        primary: this.colorScaleToPanda(palette.primary),
                        secondary: this.colorScaleToPanda(palette.secondary),
                        accent: this.colorScaleToPanda(palette.accent),
                        neutral: this.colorScaleToPanda(palette.neutral),
                        success: this.colorScaleToPanda(palette.success),
                        warning: this.colorScaleToPanda(palette.warning),
                        error: this.colorScaleToPanda(palette.error),
                        info: this.colorScaleToPanda(palette.info),
                    }
                }
            }
        }
    }

    /**
     * Generate CSS custom properties from theme configuration
     */
    generateCSSVariables(theme: ThemeConfig): string {
        const lightVars = this.themeToCSSVars(theme.light, 'light')
        const darkVars = this.themeToCSSVars(theme.dark, 'dark')

        return `
:root {
${lightVars}
}

[data-theme="dark"] {
${darkVars}
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
${darkVars}
    }
}
`.trim()
    }

    /**
     * Validate color palette consistency
     */
    validatePalette(palette: ColorPalette): boolean {
        const requiredScales = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info']

        for (const scaleName of requiredScales) {
            const scale = palette[scaleName as keyof ColorPalette]
            if (!this.validateColorScale(scale)) {
                return false
            }
        }

        return true
    }

    /**
     * Sync palette between different CSS frameworks
     */
    syncPalettes(sourcePalette: ColorPalette): {
        tailwind: Record<string, unknown>
        panda: Record<string, unknown>
        cssVars: string
    } {
        const themeConfig: ThemeConfig = {
            light: {
                colors: sourcePalette,
                semantic: this.generateSemanticColors(sourcePalette, 'light')
            },
            dark: {
                colors: sourcePalette,
                semantic: this.generateSemanticColors(sourcePalette, 'dark')
            }
        }

        return {
            tailwind: this.generateTailwindConfig(sourcePalette),
            panda: this.generatePandaConfig(sourcePalette),
            cssVars: this.generateCSSVariables(themeConfig)
        }
    }

    // Color conversion methods
    hexToRgb(hex: string): { r: number; g: number; b: number } {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 }
    }

    rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
        r /= 255
        g /= 255
        b /= 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h = 0
        let s = 0
        const l = (max + min) / 2

        if (max === min) {
            h = s = 0
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break
                case g: h = (b - r) / d + 2; break
                case b: h = (r - g) / d + 4; break
            }
            h /= 6
        }

        return { h: h * 360, s: s * 100, l: l * 100 }
    }

    hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
        h /= 360
        s /= 100
        l /= 100

        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1/6) return p + (q - p) * 6 * t
            if (t < 1/2) return q
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
            return p
        }

        let r, g, b

        if (s === 0) {
            r = g = b = l
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            r = hue2rgb(p, q, h + 1/3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1/3)
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        }
    }

    generateColorScale(baseColor: string): ColorScale {
        const rgb = this.hexToRgb(baseColor)
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)

        const scales = [95, 90, 80, 65, 50, 35, 25, 15, 10, 5, 2]
        const colorScale: Partial<ColorScale> = {}

        const scaleKeys = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const

        scaleKeys.forEach((key, index) => {
            const lightness = scales[index]
            const newRgb = this.hslToRgb(hsl.h, hsl.s, lightness)
            colorScale[key] = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`
        })

        return colorScale as ColorScale
    }

    getContrastRatio(color1: string, color2: string): number {
        const getLuminance = (hex: string): number => {
            const rgb = this.hexToRgb(hex)
            const normalize = (val: number): number => {
                val /= 255
                return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
            }

            return 0.2126 * normalize(rgb.r) + 0.7152 * normalize(rgb.g) + 0.0722 * normalize(rgb.b)
        }

        const lum1 = getLuminance(color1)
        const lum2 = getLuminance(color2)
        const brightest = Math.max(lum1, lum2)
        const darkest = Math.min(lum1, lum2)

        return (brightest + 0.05) / (darkest + 0.05)
    }

    isAccessible(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
        const contrast = this.getContrastRatio(foreground, background)
        return level === 'AAA' ? contrast >= 7 : contrast >= 4.5
    }

    // Palette generation methods
    generateComplementary(baseColor: string): ColorPalette {
        const rgb = this.hexToRgb(baseColor)
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)

        const complementaryHue = (hsl.h + 180) % 360
        const complementaryRgb = this.hslToRgb(complementaryHue, hsl.s, hsl.l)
        const complementaryHex = `#${complementaryRgb.r.toString(16).padStart(2, '0')}${complementaryRgb.g.toString(16).padStart(2, '0')}${complementaryRgb.b.toString(16).padStart(2, '0')}`

        return {
            primary: this.generateColorScale(baseColor),
            secondary: this.generateColorScale(complementaryHex),
            accent: this.generateColorScale(baseColor),
            neutral: this.generateColorScale('#6b7280'),
            success: this.generateColorScale('#10b981'),
            warning: this.generateColorScale('#f59e0b'),
            error: this.generateColorScale('#ef4444'),
            info: this.generateColorScale('#3b82f6')
        }
    }

    generateAnalogous(baseColor: string): ColorPalette {
        const rgb = this.hexToRgb(baseColor)
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)

        const analogous1Hue = (hsl.h + 30) % 360
        const analogous2Hue = (hsl.h - 30 + 360) % 360

        const analogous1Rgb = this.hslToRgb(analogous1Hue, hsl.s, hsl.l)
        const analogous2Rgb = this.hslToRgb(analogous2Hue, hsl.s, hsl.l)

        const analogous1Hex = `#${analogous1Rgb.r.toString(16).padStart(2, '0')}${analogous1Rgb.g.toString(16).padStart(2, '0')}${analogous1Rgb.b.toString(16).padStart(2, '0')}`
        const analogous2Hex = `#${analogous2Rgb.r.toString(16).padStart(2, '0')}${analogous2Rgb.g.toString(16).padStart(2, '0')}${analogous2Rgb.b.toString(16).padStart(2, '0')}`

        return {
            primary: this.generateColorScale(baseColor),
            secondary: this.generateColorScale(analogous1Hex),
            accent: this.generateColorScale(analogous2Hex),
            neutral: this.generateColorScale('#6b7280'),
            success: this.generateColorScale('#10b981'),
            warning: this.generateColorScale('#f59e0b'),
            error: this.generateColorScale('#ef4444'),
            info: this.generateColorScale('#3b82f6')
        }
    }

    generateTriadic(baseColor: string): ColorPalette {
        const rgb = this.hexToRgb(baseColor)
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)

        const triadic1Hue = (hsl.h + 120) % 360
        const triadic2Hue = (hsl.h + 240) % 360

        const triadic1Rgb = this.hslToRgb(triadic1Hue, hsl.s, hsl.l)
        const triadic2Rgb = this.hslToRgb(triadic2Hue, hsl.s, hsl.l)

        const triadic1Hex = `#${triadic1Rgb.r.toString(16).padStart(2, '0')}${triadic1Rgb.g.toString(16).padStart(2, '0')}${triadic1Rgb.b.toString(16).padStart(2, '0')}`
        const triadic2Hex = `#${triadic2Rgb.r.toString(16).padStart(2, '0')}${triadic2Rgb.g.toString(16).padStart(2, '0')}${triadic2Rgb.b.toString(16).padStart(2, '0')}`

        return {
            primary: this.generateColorScale(baseColor),
            secondary: this.generateColorScale(triadic1Hex),
            accent: this.generateColorScale(triadic2Hex),
            neutral: this.generateColorScale('#6b7280'),
            success: this.generateColorScale('#10b981'),
            warning: this.generateColorScale('#f59e0b'),
            error: this.generateColorScale('#ef4444'),
            info: this.generateColorScale('#3b82f6')
        }
    }

    generateMonochromatic(baseColor: string): ColorPalette {
        const base = this.generateColorScale(baseColor)

        return {
            primary: base,
            secondary: base,
            accent: base,
            neutral: this.generateColorScale('#6b7280'),
            success: this.generateColorScale('#10b981'),
            warning: this.generateColorScale('#f59e0b'),
            error: this.generateColorScale('#ef4444'),
            info: this.generateColorScale('#3b82f6')
        }
    }

    // Private helper methods
    private colorScaleToTailwind(scale: ColorScale): Record<string, string> {
        return {
            '50': scale[50],
            '100': scale[100],
            '200': scale[200],
            '300': scale[300],
            '400': scale[400],
            '500': scale[500],
            '600': scale[600],
            '700': scale[700],
            '800': scale[800],
            '900': scale[900],
            '950': scale[950],
        }
    }

    private colorScaleToPanda(scale: ColorScale): Record<string, { value: string }> {
        return {
            '50': { value: scale[50] },
            '100': { value: scale[100] },
            '200': { value: scale[200] },
            '300': { value: scale[300] },
            '400': { value: scale[400] },
            '500': { value: scale[500] },
            '600': { value: scale[600] },
            '700': { value: scale[700] },
            '800': { value: scale[800] },
            '900': { value: scale[900] },
            '950': { value: scale[950] },
        }
    }

    private validateColorScale(scale: ColorScale): boolean {
        const requiredShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
        return requiredShades.every(shade => scale[shade as keyof ColorScale] && /^#[0-9a-fA-F]{6}$/.test(scale[shade as keyof ColorScale]))
    }

    private themeToCSSVars(theme: { colors: ColorPalette; semantic: SemanticColors }, mode: 'light' | 'dark'): string {
        const vars: string[] = []

        // Color palette variables
        Object.entries(theme.colors).forEach(([colorName, scale]) => {
            Object.entries(scale).forEach(([shade, value]) => {
                vars.push(`  --color-${colorName}-${shade}: ${value};`)
            })
        })

        // Semantic color variables
        Object.entries(theme.semantic).forEach(([category, colors]) => {
            if (typeof colors === 'object') {
                Object.entries(colors).forEach(([variant, value]) => {
                    vars.push(`  --color-${category}-${variant}: ${value};`)
                })
            } else {
                vars.push(`  --color-${category}: ${colors};`)
            }
        })

        return vars.join('\n')
    }

    private generateSemanticColors(palette: ColorPalette, mode: 'light' | 'dark'): SemanticColors {
        if (mode === 'light') {
            return {
                background: {
                    default: palette.neutral[50],
                    muted: palette.neutral[100],
                    subtle: palette.neutral[200],
                    emphasis: palette.neutral[300]
                },
                foreground: {
                    default: palette.neutral[950],
                    muted: palette.neutral[700],
                    subtle: palette.neutral[600],
                    emphasis: palette.neutral[900]
                },
                border: {
                    default: palette.neutral[200],
                    muted: palette.neutral[100],
                    subtle: palette.neutral[150] || palette.neutral[100],
                    emphasis: palette.neutral[300]
                },
                ring: palette.primary[500]
            }
        } else {
            return {
                background: {
                    default: palette.neutral[950],
                    muted: palette.neutral[900],
                    subtle: palette.neutral[800],
                    emphasis: palette.neutral[700]
                },
                foreground: {
                    default: palette.neutral[50],
                    muted: palette.neutral[300],
                    subtle: palette.neutral[400],
                    emphasis: palette.neutral[100]
                },
                border: {
                    default: palette.neutral[800],
                    muted: palette.neutral[900],
                    subtle: palette.neutral[850] || palette.neutral[900],
                    emphasis: palette.neutral[700]
                },
                ring: palette.primary[400]
            }
        }
    }
}

// Export types
export type {
    ColorPalette,
    ColorScale,
    ThemeConfig,
    SemanticColors,
    DesignSystemSync,
    ColorConverter,
    PaletteGenerator
}

// Export default instance
export const designSystem = new UniversalDesignSystem()