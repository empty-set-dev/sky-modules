/**
 * Determine if code is running on server or client side
 *
 * Checks for window object availability to detect runtime environment.
 * Useful for conditional logic in SSR applications.
 *
 * @example
 * ```ts
 * import { runsOnServerSide, runsOnClientSide } from '@sky-modules/platform/utilities/runsOnSide'
 *
 * if (runsOnServerSide) {
 *   // Server-side only code
 *   console.log('Running on server')
 * }
 *
 * if (runsOnClientSide) {
 *   // Client-side only code
 *   document.title = 'My App'
 * }
 * ```
 *
 * @example Global usage
 * ```ts
 * import '@sky-modules/platform/utilities/runsOnSide/global'
 *
 * if (runsOnServerSide) {
 *   // Available globally
 * }
 * ```
 */
const runsOnSide = typeof window === 'undefined' ? 'server' : 'client'

export default runsOnSide

/**
 * True if code is running on the server side (Node.js)
 */
export const runsOnServerSide = runsOnSide === 'server'

/**
 * True if code is running on the client side (browser)
 */
export const runsOnClientSide = runsOnSide === 'client'
