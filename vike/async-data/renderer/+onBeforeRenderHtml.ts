import { PageContextServer } from 'vike/types'

/**
 * Vike onBeforeRenderHtml hook for async data fetching
 *
 * Executes async-data functions during SSR before HTML rendering.
 * Fetches data in parallel and merges results into pageContext.data.
 *
 * Supports AbortController for cancelling in-flight requests if needed.
 *
 * @param pageContext - Vike server-side page context
 * @param html - HTML string (passed through unchanged)
 * @returns HTML string
 *
 * @example Usage in Vike page
 * ```ts
 * // +Page.ts
 * export const config = {
 *   'async-data': [
 *     async (pageContext, signal) => {
 *       const user = await fetchUser(pageContext.routeParams.id, signal)
 *       return { user }
 *     }
 *   ]
 * }
 *
 * // In component
 * function UserPage() {
 *   const { data } = usePageContext()
 *   return <div>{data.user.name}</div>
 * }
 * ```
 */
export default async function onBeforeRenderHtml(
    pageContext: PageContextServer,
    html: string
): Promise<string> {
    const asyncData = pageContext.config['async-data']

    if (asyncData && asyncData.length > 0) {
        const abortController = new AbortController()
        pageContext.data = (
            await Promise.all(
                asyncData.map(asyncData => asyncData(pageContext, abortController.signal))
            )
        ).reduce((data: object, currentData: object) => {
            return Object.assign(data, currentData)
        }, {})
    }

    return html
}
