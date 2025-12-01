import type { ConfigEffect } from 'vike/types'

/**
 * Vike config effect for SSR control
 *
 * Controls whether Page component loads on server-side, client-side, or both.
 * When SSR is disabled (false), Page loads only on client-side.
 *
 * This is a Vike configuration helper that enables per-page SSR control.
 *
 * @param params - Config effect parameters from Vike
 * @returns Meta configuration for Page environment
 *
 * @throws Error if configValue is not a boolean
 *
 * @example Usage in Vike config
 * ```ts
 * // +config.ts
 * import ssrEffect from '@sky-modules/vike/config/ssrEffect'
 *
 * export default {
 *   meta: {
 *     ssr: {
 *       env: { config: true },
 *       effect: ssrEffect
 *     }
 *   }
 * }
 * ```
 *
 * @example Per-page SSR control
 * ```ts
 * // +Page.ts
 * export const ssr = false // Client-side only rendering
 * ```
 */
export default function ssrEffect({
    configDefinedAt,
    configValue,
}: Parameters<ConfigEffect>[0]): ReturnType<ConfigEffect> {
    if (typeof configValue !== 'boolean') throw new Error(`${configDefinedAt} should be a boolean`)
    const env = {
        // Always load on the client-side.
        client: true,
        // When the SSR flag is false, we want to render the page only on the client-side.
        // We achieve this by loading `Page` only on the client-side: when onRenderHtml()
        // gets a `Page` value that is undefined it skip server-side rendering.
        server: configValue !== false,
    }
    return {
        meta: {
            Page: { env },
        },
    }
}
