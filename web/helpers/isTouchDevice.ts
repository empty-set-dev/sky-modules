/**
 * Detect if the current device has touch input as primary pointer
 *
 * Uses media query `(pointer: coarse)` to detect touch-capable devices.
 * More reliable than checking `ontouchstart` or `maxTouchPoints` alone.
 *
 * @returns True if device primarily uses touch input
 *
 * @example
 * ```ts
 * import { isTouchDevice } from '@sky-modules/web/helpers/isTouchDevice'
 *
 * if (isTouchDevice()) {
 *   // Enable touch-friendly UI
 *   increaseTouchTargetSizes()
 * } else {
 *   // Enable hover states for mouse
 *   enableHoverEffects()
 * }
 * ```
 *
 * @example Global usage
 * ```ts
 * import '@sky-modules/web/helpers/global'
 *
 * if (isTouchDevice()) {
 *   // Available globally
 * }
 * ```
 */
export function isTouchDevice(): boolean {
    return window.matchMedia('(pointer: coarse)').matches
}
