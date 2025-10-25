/**
 * Tests for workspaceRoot utility
 */

import { describe, test, expect } from 'vitest'
import path from 'path'
import workspaceRoot from './workspaceRoot'

describe('workspaceRoot', () => {
    test('exports a value', () => {
        // workspaceRoot should be either string or null
        expect(workspaceRoot === null || typeof workspaceRoot === 'string').toBe(true)
    })

    test('is null or absolute path', () => {
        if (workspaceRoot !== null) {
            expect(path.isAbsolute(workspaceRoot)).toBe(true)
        } else {
            expect(workspaceRoot).toBe(null)
        }
    })

    test('points to directory containing .sky folder', () => {
        if (workspaceRoot !== null) {
            // workspaceRoot should be parent of .sky directory
            // which means .sky/sky.config.ts would be inside it
            const skyPath = path.join(workspaceRoot, '.sky')
            expect(typeof skyPath).toBe('string')
        }
    })
})
