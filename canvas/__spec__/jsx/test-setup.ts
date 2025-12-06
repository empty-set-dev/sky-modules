// Canvas test setup - uses centralized test utilities
import { vi } from 'vitest'
import { setupCanvasMocks } from '@sky-modules/cli/test-utils'

// Mock react-native before any imports
// react-native uses Flow syntax which Rollup can't parse
vi.mock('react-native', () => ({
    default: {},
    Platform: { OS: 'web', select: (obj: any) => obj.web || obj.default },
    StyleSheet: { create: (styles: any) => styles },
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    ScrollView: 'ScrollView',
    Dimensions: {
        get: () => ({ width: 1920, height: 1080 }),
        addEventListener: () => {},
        removeEventListener: () => {},
    },
}))

// Setup canvas mocks for all Canvas module tests
setupCanvasMocks()
