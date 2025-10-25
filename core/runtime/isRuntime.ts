import Internal from './Internal'

/**
 * Check if runtime mode is active
 * Returns true after startRuntime() completes
 */
export default function isRuntime(): boolean {
    return Internal.isRuntime
}
