import { setContext } from '@builder.io/mitosis'
import Mitosis from '@sky-modules/universal/Mitosis'

import PageContext from './Page.context.lite'

/**
 * Props for PageContextProvider component
 */
export interface PageContextProviderProps {
    /** Child components */
    children?: Mitosis.Children
    /** Vike PageContext object from SSR */
    value: Vike.PageContext
}

/**
 * PageContext provider for Vike SSR integration
 *
 * Provides Vike PageContext to child components via Mitosis context.
 * Works across all frameworks (React, Vue, Solid, Svelte, Qwik, Angular).
 *
 * @param props - Component props
 * @returns Mitosis node
 *
 * @example
 * ```tsx
 * import PageContextProvider from '@sky-modules/vike/PageContext'
 *
 * export default function Layout({ pageContext, children }) {
 *   return (
 *     <PageContextProvider value={pageContext}>
 *       {children}
 *     </PageContextProvider>
 *   )
 * }
 * ```
 *
 * @example Global usage
 * ```tsx
 * import '@sky-modules/vike/PageContext/global'
 *
 * <PageContextProvider value={pageContext}>
 *   <App />
 * </PageContextProvider>
 * ```
 */
export default function PageContextProvider(props: PageContextProviderProps): Mitosis.Node {
    setContext(PageContext, props.value)
    return <>{props.children}</>
}
