/**
 * JSX runtime for development builds
 *
 * Provides the jsxDEV() function used by TypeScript/Babel for JSX transformation in development mode.
 * Similar to jsx-runtime but with additional development features and debugging capabilities.
 *
 * @module jsx/jsx-dev-runtime
 */
import JSX from '.'

/**
 * Creates a JSX element (development version)
 *
 * Called by the TypeScript/Babel compiler when transforming JSX syntax in development mode.
 * Identical to jsx() but can include additional debugging information.
 *
 * @param type - Element type (string for intrinsic elements, function/class for components)
 * @param props - Element properties and attributes
 * @returns JSX element object
 *
 * @example
 * ```typescript
 * // JSX: <div className="box">Hello</div>
 * // Transforms to:
 * jsxDEV('div', { className: 'box', children: 'Hello' })
 * ```
 */
export function jsxDEV(type: string | Function, props: Record<string, unknown>): JSX.Element {
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
