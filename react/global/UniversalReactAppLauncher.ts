/**
 * Global module for UniversalReactAppLauncher
 *
 * Makes UniversalReactAppLauncher available globally without explicit imports.
 *
 * @example
 * ```tsx
 * // Import this module once
 * import '@sky-modules/react/global/UniversalReactAppLauncher'
 *
 * // Now use globally
 * new UniversalReactAppLauncher(App)
 * ```
 *
 * @module @sky-modules/react/global/UniversalReactAppLauncher
 */

import globalify from '@sky-modules/core/globalify'

import UniversalReactAppLauncher, * as imports from '../UniversalReactAppLauncher'

declare global {
    const UniversalReactAppLauncher: typeof imports.default
    type UniversalReactAppLauncher = typeof imports.default
}

globalify({ UniversalReactAppLauncher })
