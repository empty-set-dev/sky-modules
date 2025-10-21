/**
 * CLI constants and configuration values
 *
 * This file contains all magic numbers and hardcoded values used across the CLI.
 * Centralizing these values makes the codebase more maintainable and easier to configure.
 */

export const CLI_CONSTANTS = {
    // Timeouts (in milliseconds)
    MITOSIS_DEBOUNCE_MS: 300,
    RESTART_MIN_DELAY_MS: 3000,
    PORT_RELEASE_DELAY_MS: 1500,
    GRACEFUL_SHUTDOWN_TIMEOUT_MS: 5000,
    FORCE_EXIT_TIMEOUT_MS: 1000,

    // Default ports
    DEFAULT_WEB_PORT: 3000,

    // Memory limits
    ESLINT_MAX_MEMORY_MB: 8192,
} as const

export type CliConstants = typeof CLI_CONSTANTS

/**
 * Exit codes for the CLI
 *
 * Following standard UNIX conventions:
 * - 0: Success
 * - 1: Generic error
 * - 2+: Specific error codes
 */
export enum ExitCode {
    SUCCESS = 0,
    GENERIC_ERROR = 1,
    CONFIG_ERROR = 2,
    BUILD_ERROR = 3,
    TEST_ERROR = 4,
    DEPLOYMENT_ERROR = 5,
}
