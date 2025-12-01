/**
 * JSX runtime for production builds
 *
 * Provides the jsx() function used by TypeScript/Babel for JSX transformation in production mode.
 * Creates JSX element objects with type, props, and key.
 *
 * @module jsx/jsx-runtime
 */
import JSX from '.'

/**
 * Creates a JSX element
 *
 * Called by the TypeScript/Babel compiler when transforming JSX syntax.
 * Used in production builds (jsxImportSource configured).
 *
 * @param type - Element type (string for intrinsic elements, function/class for components)
 * @param props - Element properties and attributes
 * @returns JSX element object
 *
 * @example
 * ```typescript
 * // JSX: <div className="box">Hello</div>
 * // Transforms to:
 * jsx('div', { className: 'box', children: 'Hello' })
 * ```
 */
export function jsx(type: string | Function, props: Record<string, unknown>): JSX.Element {
    return {
        type,
        props,
        key: '',
    }
}

/**
 * Fragment element type
 *
 * Used for grouping multiple JSX elements without adding extra DOM nodes.
 */
export const Fragment = 'Fragment'
