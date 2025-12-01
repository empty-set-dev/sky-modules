/**
 * Vike configuration for React SSR
 *
 * Configures Vike framework integration for React applications with:
 * - Server-side rendering hooks
 * - Client-side hydration
 * - Base configuration extension
 * - Version requirements
 *
 * @example
 * ```ts
 * // In your app's +config.ts
 * import reactVike from '@sky-modules/react/vike/config'
 *
 * export default {
 *   extends: [reactVike]
 * }
 * ```
 *
 * @see {@link https://vike.dev/config}
 * @module @sky-modules/react/vike/config
 */

import type { Config } from 'vike/types'

export default {
    name: '@sky-modules/react/vike',
    require: {
        vike: '>=0.4.182',
    },
    extends: ['import:@sky-modules/vike/config'],
    onRenderHtml: 'import:@sky-modules/react/vike/+onRenderHtml:default',
    onRenderClient: 'import:@sky-modules/react/vike/+onRenderClient:default',
} satisfies Config
