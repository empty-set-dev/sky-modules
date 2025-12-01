import '@sky-modules/platform'
import Console from '@sky-modules/core/Console'
import { ReactNode } from 'react'
import { hydrateRoot, Root } from 'react-dom/client'

import type { PageContextClient } from 'vike/types'

let root: Root

/**
 * Vike client-side rendering hook for React
 *
 * Handles client-side hydration and navigation for Vike SSR applications.
 * - First render: hydrates server-rendered HTML
 * - Subsequent renders: updates DOM efficiently
 *
 * @param pageContext - Vike page context with Page component and URL
 *
 * @example
 * ```ts
 * // Configured in vike/config.ts
 * export default {
 *   onRenderClient: 'import:@sky-modules/react/vike/+onRenderClient:default'
 * }
 * ```
 *
 * @see {@link https://vike.dev/onRenderClient}
 */
export default async function onRenderClient(pageContext: PageContextClient): Promise<void> {
    const { Page } = pageContext

    function Root(): ReactNode {
        return <Page />
    }

    if (root) {
        root.render(<Root />)
        Console.success('Rendered', pageContext.urlOriginal)
    } else {
        root = hydrateRoot(document.getElementById('root')!, <Root />)
        Console.success('Hydrated', pageContext.urlOriginal)
    }
}
