/**
 * Tailwind Merge (twrn) for Canvas
 * Handles conflicting Tailwind/utility class merging
 */

import type { CSSProperties } from './renderCSSToCanvas'
import { parseUnit } from './jsx.box-styles-parser'

// Tailwind utility class categories (for conflict detection)
const CLASS_GROUPS = {
    // Spacing
    p: /^p-(\d+|px|\[[\w#]+\])$/,
    px: /^px-(\d+|px|\[[\w#]+\])$/,
    py: /^py-(\d+|px|\[[\w#]+\])$/,
    pt: /^pt-(\d+|px|\[[\w#]+\])$/,
    pr: /^pr-(\d+|px|\[[\w#]+\])$/,
    pb: /^pb-(\d+|px|\[[\w#]+\])$/,
    pl: /^pl-(\d+|px|\[[\w#]+\])$/,

    m: /^m-(\d+|auto|px|\[[\w#]+\])$/,
    mx: /^mx-(\d+|auto|px|\[[\w#]+\])$/,
    my: /^my-(\d+|auto|px|\[[\w#]+\])$/,
    mt: /^mt-(\d+|auto|px|\[[\w#]+\])$/,
    mr: /^mr-(\d+|auto|px|\[[\w#]+\])$/,
    mb: /^mb-(\d+|auto|px|\[[\w#]+\])$/,
    ml: /^ml-(\d+|auto|px|\[[\w#]+\])$/,

    gap: /^gap-(\d+|px|\[[\w#]+\])$/,

    // Sizing
    w: /^w-(\d+|full|screen|auto|1\/2|1\/3|2\/3|1\/4|3\/4|px|\[[\w#]+\])$/,
    'min-w': /^min-w-(\d+|full|screen|px|\[[\w#]+\])$/,
    'max-w': /^max-w-(\d+|full|screen|px|\[[\w#]+\])$/,

    h: /^h-(\d+|full|screen|auto|px|\[[\w#]+\])$/,
    'min-h': /^min-h-(\d+|full|screen|px|\[[\w#]+\])$/,
    'max-h': /^max-h-(\d+|full|screen|px|\[[\w#]+\])$/,

    // Colors
    'bg-color': /^bg-([\w-]+|\[#[\w]+\])$/,
    'text-color': /^text-([\w-]+|\[#[\w]+\])$/,
    'border-color': /^border-([\w-]+|\[#[\w]+\])$/,

    // Border
    'border-w': /^border(-\d+)?$/,
    'border-radius': /^rounded(-\w+)?$/,

    // Shadow
    shadow: /^shadow(-\w+)?$/,

    // Display
    display: /^(block|inline|flex|grid|hidden|inline-block|inline-flex|inline-grid)$/,

    // Position
    position: /^(static|fixed|absolute|relative|sticky)$/,

    // Flex
    'flex-direction': /^flex-(row|row-reverse|col|col-reverse)$/,
    'justify-content': /^justify-(start|end|center|between|around|evenly)$/,
    'align-items': /^items-(start|end|center|stretch|baseline)$/,
    'flex-wrap': /^flex-(wrap|wrap-reverse|nowrap)$/,

    // Typography
    'font-size': /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    'font-weight': /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\d+)$/,
    'text-align': /^text-(left|center|right|justify)$/,
    'line-height': /^leading-(\d+|none|tight|snug|normal|relaxed|loose)$/,

    // Transform
    scale: /^scale-(\d+)$/,
    rotate: /^rotate-(\d+)$/,
    'translate-x': /^translate-x-(\d+|px|\[[\w#]+\])$/,
    'translate-y': /^translate-y-(\d+|px|\[[\w#]+\])$/,

    // Opacity
    opacity: /^opacity-(\d+)$/,
}

/**
 * Detects which group a class belongs to
 */
function getClassGroup(className: string): string | null {
    // Remove modifiers (hover:, md:, etc.)
    const baseClass = className.split(':').pop() || className

    for (const [group, regex] of Object.entries(CLASS_GROUPS)) {
        if (regex.test(baseClass)) {
            return group
        }
    }

    return null
}

/**
 * Splits className by modifiers (hover:, md:, etc.)
 */
function parseClassWithModifiers(className: string): {
    modifiers: string[]
    base: string
} {
    const parts = className.split(':')
    const base = parts[parts.length - 1]
    const modifiers = parts.slice(0, -1)

    return { modifiers, base }
}

/**
 * Merges Tailwind classes, resolving conflicts
 * Last class wins for conflicting properties
 */
export function mergeTailwindClasses(classNames: string | string[]): string {
    const classes = Array.isArray(classNames)
        ? classNames.flatMap(cn => cn.split(/\s+/))
        : classNames.split(/\s+/)

    const classMap = new Map<string, string>()

    for (const className of classes) {
        if (!className) continue

        const { modifiers, base } = parseClassWithModifiers(className)
        const group = getClassGroup(base)

        if (!group) {
            // Not a recognized utility class, keep it
            classMap.set(className, className)
            continue
        }

        // Create a key that includes modifiers for proper scoping
        const key = [...modifiers, group].join(':')

        // Store the full className (with modifiers)
        classMap.set(key, className)
    }

    return Array.from(classMap.values()).join(' ')
}

/**
 * Converts Tailwind utility classes to CSS properties
 */
export function tailwindClassesToCSS(className: string): CSSProperties {
    const css: CSSProperties = {}
    const classes = className.split(/\s+/)

    for (const cls of classes) {
        if (!cls) continue

        // Remove modifiers (we'll handle them separately in full implementation)
        const { base } = parseClassWithModifiers(cls)

        // Padding
        if (base.startsWith('p-')) {
            const value = extractTailwindValue(base, 'p-')
            css.padding = value
        } else if (base.startsWith('px-')) {
            const value = extractTailwindValue(base, 'px-')
            css.paddingLeft = value
            css.paddingRight = value
        } else if (base.startsWith('py-')) {
            const value = extractTailwindValue(base, 'py-')
            css.paddingTop = value
            css.paddingBottom = value
        } else if (base.startsWith('pt-')) {
            css.paddingTop = extractTailwindValue(base, 'pt-')
        } else if (base.startsWith('pr-')) {
            css.paddingRight = extractTailwindValue(base, 'pr-')
        } else if (base.startsWith('pb-')) {
            css.paddingBottom = extractTailwindValue(base, 'pb-')
        } else if (base.startsWith('pl-')) {
            css.paddingLeft = extractTailwindValue(base, 'pl-')
        }

        // Margin
        else if (base.startsWith('m-')) {
            const value = extractTailwindValue(base, 'm-')
            css.margin = value
        } else if (base.startsWith('mx-')) {
            const value = extractTailwindValue(base, 'mx-')
            css.marginLeft = value
            css.marginRight = value
        } else if (base.startsWith('my-')) {
            const value = extractTailwindValue(base, 'my-')
            css.marginTop = value
            css.marginBottom = value
        } else if (base.startsWith('mt-')) {
            css.marginTop = extractTailwindValue(base, 'mt-')
        } else if (base.startsWith('mr-')) {
            css.marginRight = extractTailwindValue(base, 'mr-')
        } else if (base.startsWith('mb-')) {
            css.marginBottom = extractTailwindValue(base, 'mb-')
        } else if (base.startsWith('ml-')) {
            css.marginLeft = extractTailwindValue(base, 'ml-')
        }

        // Gap
        else if (base.startsWith('gap-')) {
            css.gap = extractTailwindValue(base, 'gap-')
        }

        // Width
        else if (base.startsWith('w-')) {
            css.width = extractTailwindSizingValue(base, 'w-')
        } else if (base.startsWith('min-w-')) {
            css.width = extractTailwindSizingValue(base, 'min-w-')
        } else if (base.startsWith('max-w-')) {
            css.width = extractTailwindSizingValue(base, 'max-w-')
        }

        // Height
        else if (base.startsWith('h-')) {
            css.height = extractTailwindSizingValue(base, 'h-')
        } else if (base.startsWith('min-h-')) {
            css.height = extractTailwindSizingValue(base, 'min-h-')
        } else if (base.startsWith('max-h-')) {
            css.height = extractTailwindSizingValue(base, 'max-h-')
        }

        // Background color
        else if (base.startsWith('bg-')) {
            const color = extractTailwindColorValue(base, 'bg-')
            if (color) css.backgroundColor = color
        }

        // Text color
        else if (base.startsWith('text-')) {
            const match = base.match(/^text-([\w-]+|\[#[\w]+\])$/)
            if (match) {
                const color = extractTailwindColorValue(base, 'text-')
                if (color) css.color = color
            } else {
                // Font size
                const sizeMap: Record<string, string> = {
                    'text-xs': '12px',
                    'text-sm': '14px',
                    'text-base': '16px',
                    'text-lg': '18px',
                    'text-xl': '20px',
                    'text-2xl': '24px',
                    'text-3xl': '30px',
                    'text-4xl': '36px',
                }
                if (sizeMap[base]) css.fontSize = sizeMap[base]
            }
        }

        // Border
        else if (base === 'border' || base.match(/^border-\d+$/)) {
            const width = base === 'border' ? '1px' : base.replace('border-', '') + 'px'
            css.borderWidth = width
        } else if (base.startsWith('rounded')) {
            const radiusMap: Record<string, string> = {
                rounded: '4px',
                'rounded-sm': '2px',
                'rounded-md': '6px',
                'rounded-lg': '8px',
                'rounded-xl': '12px',
                'rounded-2xl': '16px',
                'rounded-3xl': '24px',
                'rounded-full': '9999px',
            }
            css.borderRadius = radiusMap[base] || '4px'
        }

        // Shadow
        else if (base.startsWith('shadow')) {
            const shadowMap: Record<string, string> = {
                shadow: '0 1px 3px rgba(0,0,0,0.12)',
                'shadow-sm': '0 1px 2px rgba(0,0,0,0.05)',
                'shadow-md': '0 4px 6px rgba(0,0,0,0.1)',
                'shadow-lg': '0 10px 15px rgba(0,0,0,0.1)',
                'shadow-xl': '0 20px 25px rgba(0,0,0,0.1)',
            }
            css.boxShadow = shadowMap[base] || shadowMap['shadow']
        }

        // Flex
        else if (base.startsWith('flex-')) {
            if (base.match(/^flex-(row|col)/)) {
                const dirMap: Record<string, string> = {
                    'flex-row': 'row',
                    'flex-row-reverse': 'row-reverse',
                    'flex-col': 'column',
                    'flex-col-reverse': 'column-reverse',
                }
                css.flexDirection = dirMap[base] as never
            }
        } else if (base.startsWith('justify-')) {
            const justifyMap: Record<string, string> = {
                'justify-start': 'flex-start',
                'justify-end': 'flex-end',
                'justify-center': 'center',
                'justify-between': 'space-between',
                'justify-around': 'space-around',
                'justify-evenly': 'space-evenly',
            }
            css.justifyContent = justifyMap[base] as never
        } else if (base.startsWith('items-')) {
            const itemsMap: Record<string, string> = {
                'items-start': 'flex-start',
                'items-end': 'flex-end',
                'items-center': 'center',
                'items-stretch': 'stretch',
                'items-baseline': 'baseline',
            }
            css.alignItems = itemsMap[base] as never
        }

        // Display
        else if (['block', 'inline', 'flex', 'grid', 'hidden'].includes(base)) {
            css.display = base === 'hidden' ? 'none' : base
        }

        // Opacity
        else if (base.startsWith('opacity-')) {
            const value = parseInt(base.replace('opacity-', ''))
            css.opacity = value / 100
        }
    }

    return css
}

/**
 * Extracts spacing value from Tailwind class (p-4, m-8, etc.)
 */
function extractTailwindValue(className: string, prefix: string): string {
    const value = className.replace(prefix, '')

    // Arbitrary value [123px]
    if (value.startsWith('[') && value.endsWith(']')) {
        return value.slice(1, -1)
    }

    // Numeric scale (4 = 1rem = 16px in Tailwind)
    const num = parseInt(value)
    if (!isNaN(num)) {
        return `${num * 4}px`
    }

    return value
}

/**
 * Extracts sizing value from Tailwind class (w-full, h-screen, etc.)
 */
function extractTailwindSizingValue(className: string, prefix: string): string {
    const value = className.replace(prefix, '')

    // Arbitrary value
    if (value.startsWith('[') && value.endsWith(']')) {
        return value.slice(1, -1)
    }

    // Special values
    const sizeMap: Record<string, string> = {
        full: '100%',
        screen: '100vw',
        auto: 'auto',
        '1/2': '50%',
        '1/3': '33.333%',
        '2/3': '66.667%',
        '1/4': '25%',
        '3/4': '75%',
    }

    if (sizeMap[value]) return sizeMap[value]

    // Numeric scale
    const num = parseInt(value)
    if (!isNaN(num)) {
        return `${num * 4}px`
    }

    return value
}

/**
 * Extracts color value from Tailwind class
 */
function extractTailwindColorValue(className: string, prefix: string): string | null {
    const value = className.replace(prefix, '')

    // Arbitrary value [#abc123]
    if (value.startsWith('[') && value.endsWith(']')) {
        return value.slice(1, -1)
    }

    // Basic colors
    const colorMap: Record<string, string> = {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        white: '#ffffff',
        red: '#ef4444',
        blue: '#3b82f6',
        green: '#10b981',
        yellow: '#f59e0b',
        purple: '#8b5cf6',
        pink: '#ec4899',
        gray: '#6b7280',
    }

    return colorMap[value] || null
}
