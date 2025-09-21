// packages/core/src/dev-runtime/panda-compat.ts
import { hash } from 'ohash'

// Кэш для сгенерированных классов
const styleCache = new Map<string, string>()
const cssSheet = typeof document !== 'undefined' ? document.createElement('style') : null

if (cssSheet) {
    cssSheet.id = 'dev-panda-compat'
    document.head.appendChild(cssSheet)
}

// Конвертер prop-to-css
const propToCSS: Record<string, string> = {
    w: 'width',
    h: 'height',
    p: 'padding',
    pt: 'padding-top',
    pr: 'padding-right',
    pb: 'padding-bottom',
    pl: 'padding-left',
    m: 'margin',
    mt: 'margin-top',
    mr: 'margin-right',
    mb: 'margin-bottom',
    ml: 'margin-left',
    bg: 'background',
    bgColor: 'background-color',
    color: 'color',
    display: 'display',
    flex: 'flex',
    flexDir: 'flex-direction',
    justify: 'justify-content',
    align: 'align-items',
    gap: 'gap',
    pos: 'position',
    rounded: 'border-radius',
    shadow: 'box-shadow',
    minW: 'min-width',
    minH: 'min-height',
    maxW: 'max-width',
    maxH: 'max-height',
    overflow: 'overflow',
    opacity: 'opacity',
    cursor: 'cursor',
    zIndex: 'z-index',
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
    border: 'border',
    borderColor: 'border-color',
    borderWidth: 'border-width',
    borderStyle: 'border-style',
    borderRadius: 'border-radius',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    lineHeight: 'line-height',
    letterSpacing: 'letter-spacing',
    textAlign: 'text-align',
    textTransform: 'text-transform',
    textDecoration: 'text-decoration',
    transition: 'transition',
    transform: 'transform',
    animation: 'animation',
    grid: 'grid',
    gridTemplate: 'grid-template',
    gridTemplateColumns: 'grid-template-columns',
    gridTemplateRows: 'grid-template-rows',
    gridColumn: 'grid-column',
    gridRow: 'grid-row',
    gridGap: 'grid-gap',
    placeItems: 'place-items',
    placeContent: 'place-content',
    placeSelf: 'place-self',
    flexWrap: 'flex-wrap',
    flexGrow: 'flex-grow',
    flexShrink: 'flex-shrink',
    flexBasis: 'flex-basis',
    order: 'order',
    alignSelf: 'align-self',
    justifySelf: 'justify-self',
}

// Конвертер значений
const convertValue = (prop: string, value: any): string => {
    // Числа в rem/px
    if (typeof value === 'number') {
        // Spacing scale (4px base)
        if (
            ['p', 'pt', 'pr', 'pb', 'pl', 'm', 'mt', 'mr', 'mb', 'ml', 'gap', 'gridGap'].includes(
                prop
            )
        ) {
            return `${value * 0.25}rem` // 1 = 0.25rem, 4 = 1rem, etc.
        }
        // Размеры в px
        if (
            ['w', 'h', 'minW', 'minH', 'maxW', 'maxH', 'top', 'right', 'bottom', 'left'].includes(
                prop
            )
        ) {
            return `${value}px`
        }
        // font-weight, z-index, opacity остаются числами
        if (['fontWeight', 'zIndex', 'opacity', 'flexGrow', 'flexShrink', 'order'].includes(prop)) {
            return String(value)
        }
        return `${value}px`
    }

    // Токены из темы
    if (typeof value === 'string') {
        // colors.red.500 -> var(--colors-red-500)
        if (value.includes('.') && !value.includes(' ') && !value.includes('(')) {
            return `var(--${value.replace(/\./g, '-')})`
        }
    }

    return value
}

// Генератор медиа-запросов
const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
}

// Флаг для включения валидации
const VALIDATE_STYLES = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'

// Проверка на динамические значения
function validateStyles(styles: Record<string, any>, path = '') {
    if (!VALIDATE_STYLES) return

    const warnings: string[] = []

    Object.entries(styles).forEach(([key, value]) => {
        // Проверяем, что значение не является переменной
        if (typeof value === 'undefined') {
            warnings.push(`Dynamic style detected: ${path}${key} is undefined`)
        }

        // Проверяем функции (они точно не сработают в Panda)
        if (typeof value === 'function') {
            console.error(`❌ Function in styles: ${path}${key}`)
            throw new Error('Dynamic function in styles - will fail in production')
        }

        // Рекурсивно проверяем вложенные объекты
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            validateStyles(value, `${path}${key}.`)
        }
    })

    if (warnings.length > 0) {
        console.warn('⚠️  Panda CSS Compatibility Warnings:')
        warnings.forEach(w => console.warn(`   ${w}`))
        console.warn('These dynamic styles work in dev but will fail in production!')
        console.warn('Solutions:')
        console.warn('  1. Use CSS variables for dynamic values')
        console.warn('  2. Use predefined variants')
        console.warn('  3. Use inline styles for truly dynamic values')
    }
}

// Runtime CSS генератор (как Emotion, но проще)
export function css(styles: Record<string, any>): string {
    // Валидация в dev режиме
    if (VALIDATE_STYLES) {
        validateStyles(styles)
    }

    const cacheKey = hash(styles)

    if (styleCache.has(cacheKey)) {
        return styleCache.get(cacheKey)!
    }

    const className = `panda-dev-${cacheKey}`
    let cssText = ''
    let baseStyles = ''
    const mediaStyles: Record<string, string> = {}
    const pseudoStyles: Record<string, string> = {}

    // Обрабатываем стили
    Object.entries(styles).forEach(([key, value]) => {
        // Респонсив объекты { base: 100, md: 200 }
        if (typeof value === 'object' && !Array.isArray(value) && !key.startsWith('_')) {
            Object.entries(value).forEach(([bp, val]) => {
                if (val === undefined || val === null) return

                const cssValue = convertValue(key, val)
                const cssProp = propToCSS[key] || key

                if (bp === 'base') {
                    baseStyles += `${cssProp}: ${cssValue}; `
                } else if (breakpoints[bp as keyof typeof breakpoints]) {
                    const media = `@media (min-width: ${breakpoints[bp as keyof typeof breakpoints]})`
                    mediaStyles[media] = (mediaStyles[media] || '') + `${cssProp}: ${cssValue}; `
                }
            })
        }
        // Респонсив массивы [100, 200, 300]
        else if (Array.isArray(value)) {
            const bps = ['base', ...Object.keys(breakpoints)]
            value.forEach((val, i) => {
                if (val === undefined || val === null) return

                const cssValue = convertValue(key, val)
                const cssProp = propToCSS[key] || key

                if (i === 0) {
                    baseStyles += `${cssProp}: ${cssValue}; `
                } else if (bps[i] && breakpoints[bps[i] as keyof typeof breakpoints]) {
                    const media = `@media (min-width: ${breakpoints[bps[i] as keyof typeof breakpoints]})`
                    mediaStyles[media] = (mediaStyles[media] || '') + `${cssProp}: ${cssValue}; `
                }
            })
        }
        // Псевдо-классы и модификаторы
        else if (key.startsWith('_')) {
            const pseudoMap: Record<string, string> = {
                _hover: ':hover',
                _focus: ':focus',
                _active: ':active',
                _disabled: ':disabled',
                _before: '::before',
                _after: '::after',
                _firstChild: ':first-child',
                _lastChild: ':last-child',
                _odd: ':nth-child(odd)',
                _even: ':nth-child(even)',
                _focusWithin: ':focus-within',
                _focusVisible: ':focus-visible',
                _placeholder: '::placeholder',
                _selection: '::selection',
                _dark: '.dark &',
                _light: '.light &',
                _rtl: '[dir="rtl"] &',
                _ltr: '[dir="ltr"] &',
                _groupHover: '.group:hover &',
                _groupFocus: '.group:focus &',
                _groupActive: '.group:active &',
            }

            const pseudo = pseudoMap[key] || key.replace('_', ':')

            if (typeof value === 'object') {
                // Рекурсивно обрабатываем вложенные стили
                let nestedStyles = ''
                Object.entries(value).forEach(([nestedKey, nestedVal]) => {
                    const cssProp = propToCSS[nestedKey] || nestedKey
                    const cssValue = convertValue(nestedKey, nestedVal)
                    nestedStyles += `${cssProp}: ${cssValue}; `
                })

                if (pseudo.includes('&')) {
                    // Селекторы с & (parent reference)
                    pseudoStyles[pseudo.replace('&', `.${className}`)] = nestedStyles
                } else {
                    // Обычные псевдо-классы
                    pseudoStyles[`.${className}${pseudo}`] = nestedStyles
                }
            }
        }
        // Обычные стили
        else if (value !== undefined && value !== null) {
            const cssProp = propToCSS[key] || key
            const cssValue = convertValue(key, value)
            baseStyles += `${cssProp}: ${cssValue}; `
        }
    })

    // Собираем CSS
    if (baseStyles) {
        cssText = `.${className} { ${baseStyles}} `
    }

    // Добавляем псевдо-классы
    Object.entries(pseudoStyles).forEach(([selector, styles]) => {
        cssText += `${selector} { ${styles}} `
    })

    // Добавляем медиа-запросы
    Object.entries(mediaStyles).forEach(([media, styles]) => {
        cssText += `${media} { .${className} { ${styles}} } `
    })

    // Инжектим в DOM
    if (cssSheet) {
        cssSheet.innerHTML += cssText
    }

    // Кэшируем
    styleCache.set(cacheKey, className)

    return className
}

// Styled API для компонентов
export function styled<T extends keyof JSX.IntrinsicElements>(tag: T, styles: Record<string, any>) {
    const className = css(styles)

    return (props: JSX.IntrinsicElements[T] & { class?: string }) => {
        const Element = tag as any
        return <Element {...props} class={`${className} ${props.class || ''}`} />
    }
}

// CVA-like API для вариантов
export function cva(config: {
    base?: Record<string, any>
    variants?: Record<string, Record<string, Record<string, any>>>
    compoundVariants?: Array<{
        conditions: Record<string, any>
        styles: Record<string, any>
    }>
    defaultVariants?: Record<string, any>
}) {
    return (props?: Record<string, any>) => {
        const variantProps = { ...config.defaultVariants, ...props }
        let styles = { ...config.base }

        // Применяем варианты
        if (config.variants) {
            Object.entries(variantProps).forEach(([key, value]) => {
                if (config.variants![key] && config.variants![key][value as string]) {
                    Object.assign(styles, config.variants![key][value as string])
                }
            })
        }

        // Применяем составные варианты
        if (config.compoundVariants) {
            config.compoundVariants.forEach(({ conditions, styles: compoundStyles }) => {
                const matches = Object.entries(conditions).every(
                    ([key, value]) => variantProps[key] === value
                )
                if (matches) {
                    Object.assign(styles, compoundStyles)
                }
            })
        }

        return css(styles)
    }
}
