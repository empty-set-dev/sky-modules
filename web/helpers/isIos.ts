/**
 * Detect if the current device is running iOS
 *
 * Checks user agent for iPhone, iPad, iPod, and detects iPadOS
 * (which reports as MacIntel with touch support).
 *
 * @returns True if running on iOS device
 *
 * @example
 * ```ts
 * import isIos from '@sky-modules/web/helpers/isIos'
 *
 * if (isIos()) {
 *   // iOS-specific behavior
 *   enableIOSScrollFix()
 * }
 * ```
 *
 * @example Global usage
 * ```ts
 * import '@sky-modules/web/helpers/global'
 *
 * if (isIos()) {
 *   // Available globally
 * }
 * ```
 */
export default function isIos(): boolean {
    const ua = navigator.userAgent
    const platform = navigator.platform

    return /iPhone|iPad|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

/**
 * Get iOS version number
 *
 * Extracts the major version number from the user agent string.
 *
 * @returns iOS version number or null if not iOS or version cannot be determined
 *
 * @example
 * ```ts
 * import { getIosVersion } from '@sky-modules/web/helpers/isIos'
 *
 * const version = getIosVersion()
 * if (version && version >= 15) {
 *   // iOS 15+ features
 * }
 * ```
 */
export function getIosVersion(): number | null {
    const match = navigator.userAgent.match(/OS (\d+)_/)
    return match ? parseInt(match[1], 10) : null
}
