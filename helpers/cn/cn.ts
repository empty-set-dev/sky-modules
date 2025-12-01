import { isTemplateStringsArray } from '@sky-modules/core/type-guards'
import clsx, { ClassValue, ClassArray } from 'clsx'

/**
 * Type for the class name builder function that supports both template literals and arguments.
 */
export type Cx = ((template: TemplateStringsArray, ...args: ClassArray) => string) &
    ((arg: ClassValue, ...args: ClassArray) => string)

/**
 * Default class name builder instance without CSS modules mapping.
 *
 * @example
 * ```typescript
 * import { cx } from '@sky-modules/helpers/cn'
 *
 * const className = cx('button', isActive && 'active', { disabled })
 * ```
 */
export const cx = cn()

/**
 * Creates a class name builder function with optional CSS modules support.
 *
 * This function is similar to clsx but adds support for:
 * - Template literal syntax
 * - CSS modules mapping via @ prefix
 * - Automatic whitespace normalization
 *
 * @param styles Optional CSS modules object mapping local names to scoped names
 * @returns Class name builder function
 *
 * @example Without CSS modules
 * ```typescript
 * import cn from '@sky-modules/helpers/cn'
 *
 * const cx = cn()
 * const className = cx('btn', isActive && 'btn-active', { 'btn-disabled': isDisabled })
 * // Returns: "btn btn-active" (if isActive=true, isDisabled=false)
 * ```
 *
 * @example With CSS modules
 * ```typescript
 * import cn from '@sky-modules/helpers/cn'
 * import styles from './Button.module.css'
 *
 * const cx = cn(styles)
 * const className = cx('@button', isActive && '@active')
 * // '@' prefix resolves to styles.button and styles.active
 * ```
 *
 * @example Template literal syntax
 * ```typescript
 * const cx = cn()
 * const className = cx`
 *   base-class
 *   ${isActive && 'active'}
 *   ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
 * `
 * ```
 */
export default function cn(styles?: Record<string, string>): Cx {
    return (...args: ClassArray) => {
        let className = ''

        if (isTemplateStringsArray(args[0])) {
            className = String.raw(
                args[0],
                args.slice(1).map(value => clsx(value))
            )
        } else {
            className = args.map(value => clsx(value)).join(' ')
        }

        className = className
            .replaceAll(/[ \t\n\r]+/g, ' ')
            .trim()
            .split(' ')
            .map(className => getClassName(className, styles))
            .join(' ')

        return className
    }
}

function getClassName(className: string, styles?: Record<string, string>): string {
    if (className.startsWith('@')) {
        className = className.slice(1)

        if (styles == null || styles[className] == null) {
            throw new Error(`missing style for .${className}`)
        }

        return styles[className]
    }

    return className
}
