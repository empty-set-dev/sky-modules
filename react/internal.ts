import { createContext } from 'react'

/**
 * Internal utilities for React module
 *
 * Contains internal implementations not intended for external use.
 *
 * @internal
 */
namespace Internal {
    /**
     * React context for Vike page context
     *
     * Used internally by Vike integration to provide page context to components.
     */
    export const PageContext = createContext<null | Vike.PageContext>(null)
}

export default Internal
