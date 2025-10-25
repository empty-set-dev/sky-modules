/**
 * Tests for path helper utilities
 */

import { describe, test, expect } from 'vitest'
import {
    EXCLUDED_DIRS,
    IGNORED_PATTERNS,
    MODULE_EXTENSION_REGEX,
    PATH_SEPARATOR_REGEX,
    extractModuleName,
    removeExtension,
    shouldSkipDirectory,
} from './pathHelpers'

describe('pathHelpers', () => {
    describe('constants', () => {
        test('EXCLUDED_DIRS contains common exclusions', () => {
            expect(EXCLUDED_DIRS).toContain('.')
            expect(EXCLUDED_DIRS).toContain('node_modules')
            expect(EXCLUDED_DIRS).toContain('dist')
        })

        test('IGNORED_PATTERNS contains glob patterns', () => {
            expect(IGNORED_PATTERNS).toContain('**/node_modules/**')
            expect(IGNORED_PATTERNS).toContain('**/.dev/**')
            expect(IGNORED_PATTERNS).toContain('**/boilerplates/**')
        })

        test('MODULE_EXTENSION_REGEX matches common extensions', () => {
            expect(MODULE_EXTENSION_REGEX.test('file.ts')).toBe(true)
            expect(MODULE_EXTENSION_REGEX.test('file.tsx')).toBe(true)
            expect(MODULE_EXTENSION_REGEX.test('file.js')).toBe(true)
            expect(MODULE_EXTENSION_REGEX.test('file.jsx')).toBe(true)
            expect(MODULE_EXTENSION_REGEX.test('file.css')).toBe(false)
            expect(MODULE_EXTENSION_REGEX.test('file.md')).toBe(false)
        })

        test('PATH_SEPARATOR_REGEX matches path separators', () => {
            expect(PATH_SEPARATOR_REGEX.test('src/components')).toBe(true)
            expect(PATH_SEPARATOR_REGEX.test('src\\components')).toBe(true)
            expect(PATH_SEPARATOR_REGEX.test('C:components')).toBe(true)
            expect(PATH_SEPARATOR_REGEX.test('nopath')).toBe(false)
        })
    })

    describe('extractModuleName', () => {
        test('extracts module name from Unix path', () => {
            expect(extractModuleName('src/components/Button')).toBe('Button')
        })

        test('extracts module name from Windows path', () => {
            expect(extractModuleName('src\\components\\Button')).toBe('Button')
        })

        test('extracts module name from path with drive letter', () => {
            expect(extractModuleName('C:\\src\\components\\Button')).toBe('Button')
        })

        test('handles single component', () => {
            expect(extractModuleName('Button')).toBe('Button')
        })

        test('handles empty path', () => {
            expect(extractModuleName('')).toBe('')
        })

        test('handles nested paths', () => {
            expect(extractModuleName('src/ui/components/forms/Button')).toBe('Button')
        })
    })

    describe('removeExtension', () => {
        test('removes .ts extension', () => {
            expect(removeExtension('Button.ts')).toBe('Button')
        })

        test('removes .tsx extension', () => {
            expect(removeExtension('Button.tsx')).toBe('Button')
        })

        test('removes .js extension', () => {
            expect(removeExtension('Button.js')).toBe('Button')
        })

        test('removes .jsx extension', () => {
            expect(removeExtension('Button.jsx')).toBe('Button')
        })

        test('does not remove other extensions', () => {
            expect(removeExtension('Button.css')).toBe('Button.css')
            expect(removeExtension('README.md')).toBe('README.md')
        })

        test('handles filename without extension', () => {
            expect(removeExtension('Button')).toBe('Button')
        })

        test('handles empty string', () => {
            expect(removeExtension('')).toBe('')
        })

        test('handles index files', () => {
            expect(removeExtension('index.ts')).toBe('index')
            expect(removeExtension('index.tsx')).toBe('index')
        })
    })

    describe('shouldSkipDirectory', () => {
        describe('hidden directories', () => {
            test('skips directories starting with dot', () => {
                expect(shouldSkipDirectory('.git', false)).toBe(true)
                expect(shouldSkipDirectory('.dev', false)).toBe(true)
                expect(shouldSkipDirectory('.vscode', false)).toBe(true)
            })

            test('skips current directory', () => {
                expect(shouldSkipDirectory('.', false)).toBe(true)
            })
        })

        describe('common exclusions', () => {
            test('skips node_modules', () => {
                expect(shouldSkipDirectory('node_modules', false)).toBe(true)
                expect(shouldSkipDirectory('node_modules', true)).toBe(true)
            })

            test('skips dist', () => {
                expect(shouldSkipDirectory('dist', false)).toBe(true)
                expect(shouldSkipDirectory('dist', true)).toBe(true)
            })
        })

        describe('separate modules', () => {
            test('skips directories in separateModules list when not root', () => {
                const separateModules = ['components', 'utils']

                expect(shouldSkipDirectory('components', false, separateModules)).toBe(true)
                expect(shouldSkipDirectory('utils', false, separateModules)).toBe(true)
            })

            test('does not skip directories in separateModules list when root', () => {
                const separateModules = ['components', 'utils']

                expect(shouldSkipDirectory('components', true, separateModules)).toBe(false)
                expect(shouldSkipDirectory('utils', true, separateModules)).toBe(false)
            })

            test('does not skip directories not in separateModules list', () => {
                const separateModules = ['components']

                expect(shouldSkipDirectory('utils', false, separateModules)).toBe(false)
                expect(shouldSkipDirectory('hooks', false, separateModules)).toBe(false)
            })
        })

        describe('normal directories', () => {
            test('does not skip normal directories', () => {
                expect(shouldSkipDirectory('components', false)).toBe(false)
                expect(shouldSkipDirectory('utils', false)).toBe(false)
                expect(shouldSkipDirectory('src', false)).toBe(false)
            })

            test('does not skip normal directories at root', () => {
                expect(shouldSkipDirectory('components', true)).toBe(false)
                expect(shouldSkipDirectory('utils', true)).toBe(false)
                expect(shouldSkipDirectory('src', true)).toBe(false)
            })
        })

        describe('edge cases', () => {
            test('handles empty string', () => {
                expect(shouldSkipDirectory('', false)).toBe(false)
            })

            test('handles undefined separateModules', () => {
                expect(shouldSkipDirectory('components', false, undefined)).toBe(false)
            })

            test('handles empty separateModules array', () => {
                expect(shouldSkipDirectory('components', false, [])).toBe(false)
            })
        })
    })
})
