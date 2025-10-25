import '@sky-modules/core/define/global'

/**
 * Global test setup that runs before all tests
 * This file can be imported in specific test files that need common setup
 */

// Global test timeout (can be overridden per test)
export const DEFAULT_TEST_TIMEOUT = 5000

// Common test utilities and helpers
export { setupCanvasMocks, MockCanvasRenderingContext2D, MockHTMLCanvasElement } from './mocks/canvas'
