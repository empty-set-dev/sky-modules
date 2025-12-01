import { useContext } from '@builder.io/mitosis'

import PageContext from './Page.context.lite'

/**
 * Hook to access Vike PageContext in components
 *
 * Retrieves PageContext from Mitosis context provided by PageContextProvider.
 * Works in any framework compiled from Mitosis.
 *
 * @returns Vike PageContext object
 *
 * @example
 * ```tsx
 * import usePageContext from '@sky-modules/vike/PageContext/usePageContext'
 *
 * function MyComponent() {
 *   const pageContext = usePageContext()
 *
 *   return <div>Current URL: {pageContext.urlPathname}</div>
 * }
 * ```
 *
 * @example Global usage
 * ```tsx
 * import '@sky-modules/vike/PageContext/global'
 *
 * function MyComponent() {
 *   const ctx = usePageContext()
 *   // ...
 * }
 * ```
 */
export default function usePageContext(): Vike.PageContext {
    return useContext(PageContext) as Vike.PageContext
}
