/**
 * Tests for generate command helpers
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'fs'
import path from 'path'
import {
    getSeparateModules,
    hasModuleFiles,
    hasLiteFiles,
    toValidIdentifier,
    generateIndexForDirectory,
    generateGlobalForDirectory,
} from './generateHelpers'

describe('generateHelpers', () => {
    const testRoot = path.join(process.cwd(), '.dev', 'test-generate-helpers')

    beforeEach(() => {
        // Clean up and create test directory
        if (existsSync(testRoot)) {
            rmSync(testRoot, { recursive: true, force: true })
        }
        mkdirSync(testRoot, { recursive: true })
    })

    afterEach(() => {
        // Clean up
        if (existsSync(testRoot)) {
            rmSync(testRoot, { recursive: true, force: true })
        }
    })

    describe('getSeparateModules', () => {
        test('returns empty array if slice.json does not exist', () => {
            const result = getSeparateModules(testRoot)
            expect(result).toEqual([])
        })

        test('returns empty array if slice.json has no separateModules', () => {
            const sliceJson = { name: 'test' }
            writeFileSync(path.join(testRoot, 'slice.json'), JSON.stringify(sliceJson))

            const result = getSeparateModules(testRoot)
            expect(result).toEqual([])
        })

        test('returns separateModules from slice.json', () => {
            const sliceJson = {
                name: 'test',
                separateModules: ['module1', 'module2', 'module3'],
            }
            writeFileSync(path.join(testRoot, 'slice.json'), JSON.stringify(sliceJson))

            const result = getSeparateModules(testRoot)
            expect(result).toEqual(['module1', 'module2', 'module3'])
        })

        test('returns empty array if slice.json is malformed', () => {
            writeFileSync(path.join(testRoot, 'slice.json'), 'invalid json{')

            const result = getSeparateModules(testRoot)
            expect(result).toEqual([])
        })

        test('handles nested path', () => {
            const nested = path.join(testRoot, 'nested', 'deep')
            mkdirSync(nested, { recursive: true })

            const sliceJson = { separateModules: ['test'] }
            writeFileSync(path.join(nested, 'slice.json'), JSON.stringify(sliceJson))

            const result = getSeparateModules(nested)
            expect(result).toEqual(['test'])
        })
    })

    describe('hasModuleFiles', () => {
        test('returns false for empty directory', () => {
            expect(hasModuleFiles(testRoot)).toBe(false)
        })

        test('returns true if directory has .ts module', () => {
            writeFileSync(path.join(testRoot, 'module.ts'), 'export const test = 1')
            expect(hasModuleFiles(testRoot)).toBe(true)
        })

        test('returns true if directory has .tsx module', () => {
            writeFileSync(path.join(testRoot, 'Component.tsx'), 'export const Component = () => {}')
            expect(hasModuleFiles(testRoot)).toBe(true)
        })

        test('returns false if only has test files', () => {
            writeFileSync(path.join(testRoot, 'module.test.ts'), 'test code')
            writeFileSync(path.join(testRoot, 'other.spec.ts'), 'test code')
            expect(hasModuleFiles(testRoot)).toBe(false)
        })

        test('returns false if only has index files', () => {
            writeFileSync(path.join(testRoot, 'index.ts'), 'export * from "./module"')
            expect(hasModuleFiles(testRoot)).toBe(false)
        })

        test('returns false if only has global files', () => {
            writeFileSync(path.join(testRoot, 'global.ts'), 'global code')
            writeFileSync(path.join(testRoot, 'Array.global.ts'), 'global extension')
            expect(hasModuleFiles(testRoot)).toBe(false)
        })

        test('returns false if only has example files', () => {
            writeFileSync(path.join(testRoot, 'Button.example.tsx'), 'example code')
            expect(hasModuleFiles(testRoot)).toBe(false)
        })

        test('returns true if has at least one valid module', () => {
            writeFileSync(path.join(testRoot, 'index.ts'), 'export')
            writeFileSync(path.join(testRoot, 'test.spec.ts'), 'test')
            writeFileSync(path.join(testRoot, 'module.ts'), 'export const x = 1')
            expect(hasModuleFiles(testRoot)).toBe(true)
        })

        test('returns false for non-existent directory', () => {
            expect(hasModuleFiles(path.join(testRoot, 'nonexistent'))).toBe(false)
        })
    })

    describe('hasLiteFiles', () => {
        test('returns false for empty directory', () => {
            expect(hasLiteFiles(testRoot)).toBe(false)
        })

        test('returns true if directory has .lite.ts file', () => {
            writeFileSync(path.join(testRoot, 'Component.lite.ts'), 'export default {}')
            expect(hasLiteFiles(testRoot)).toBe(true)
        })

        test('returns true if directory has .lite.tsx file', () => {
            writeFileSync(path.join(testRoot, 'Component.lite.tsx'), 'export default component')
            expect(hasLiteFiles(testRoot)).toBe(true)
        })

        test('returns false if directory has only regular files', () => {
            writeFileSync(path.join(testRoot, 'module.ts'), 'export const test = 1')
            writeFileSync(path.join(testRoot, 'other.tsx'), 'export const Other = {}')
            expect(hasLiteFiles(testRoot)).toBe(false)
        })

        test('returns false for non-existent directory', () => {
            expect(hasLiteFiles(path.join(testRoot, 'nonexistent'))).toBe(false)
        })

        test('detects .lite files among regular files', () => {
            writeFileSync(path.join(testRoot, 'regular.ts'), 'export const x = 1')
            writeFileSync(path.join(testRoot, 'Component.lite.tsx'), 'export default {}')
            writeFileSync(path.join(testRoot, 'other.ts'), 'export const y = 2')
            expect(hasLiteFiles(testRoot)).toBe(true)
        })
    })

    describe('toValidIdentifier', () => {
        test('replaces hyphens with underscores', () => {
            expect(toValidIdentifier('my-module')).toBe('my_module')
        })

        test('replaces dots with underscores', () => {
            expect(toValidIdentifier('my.module')).toBe('my_module')
        })

        test('replaces both hyphens and dots', () => {
            expect(toValidIdentifier('my-module.name')).toBe('my_module_name')
        })

        test('handles multiple consecutive replacements', () => {
            expect(toValidIdentifier('my--module..name')).toBe('my__module__name')
        })

        test('does not modify valid identifiers', () => {
            expect(toValidIdentifier('myModule')).toBe('myModule')
            expect(toValidIdentifier('_myModule')).toBe('_myModule')
            expect(toValidIdentifier('myModule123')).toBe('myModule123')
        })

        test('handles empty string', () => {
            expect(toValidIdentifier('')).toBe('')
        })

        test('handles underscores', () => {
            expect(toValidIdentifier('my_module')).toBe('my_module')
        })
    })

    describe('generateIndexForDirectory', () => {
        test('generates index for directory with single module', () => {
            writeFileSync(path.join(testRoot, 'module.ts'), 'export const test = 1')

            const result = generateIndexForDirectory(testRoot)

            expect(result).toContain("export * from './module'")
        })

        test('generates index for directory with multiple modules', () => {
            writeFileSync(path.join(testRoot, 'module1.ts'), 'export const test1 = 1')
            writeFileSync(path.join(testRoot, 'module2.ts'), 'export const test2 = 2')

            const result = generateIndexForDirectory(testRoot)

            expect(result).toContain("export * from './module1'")
            expect(result).toContain("export * from './module2'")
        })

        test('skips test files', () => {
            writeFileSync(path.join(testRoot, 'module.ts'), 'export const test = 1')
            writeFileSync(path.join(testRoot, 'module.test.ts'), 'test code')

            const result = generateIndexForDirectory(testRoot)

            expect(result).toContain("export * from './module'")
            expect(result).not.toContain('test.ts')
        })

        test('skips index files', () => {
            writeFileSync(path.join(testRoot, 'module.ts'), 'export const test = 1')
            writeFileSync(path.join(testRoot, 'index.ts'), 'index')

            const result = generateIndexForDirectory(testRoot)

            expect(result).toContain("export * from './module'")
            expect(result).not.toContain("from './index'")
        })

        test('skips global files', () => {
            writeFileSync(path.join(testRoot, 'module.ts'), 'export const test = 1')
            writeFileSync(path.join(testRoot, 'Array.global.ts'), 'global')

            const result = generateIndexForDirectory(testRoot)

            expect(result).toContain("export * from './module'")
            expect(result).not.toContain('global')
        })

        test('returns empty message for empty directory', () => {
            const result = generateIndexForDirectory(testRoot)
            expect(result).toContain('No modules to export')
        })

        test('includes directories with index.ts', () => {
            const subDir = path.join(testRoot, 'submodule')
            mkdirSync(subDir)
            writeFileSync(path.join(subDir, 'index.ts'), 'export const test = 1')

            const result = generateIndexForDirectory(testRoot)

            expect(result).toContain("export * from './submodule'")
        })

        test('skips directories in separateModules', () => {
            const sub1 = path.join(testRoot, 'sub1')
            const sub2 = path.join(testRoot, 'sub2')
            mkdirSync(sub1)
            mkdirSync(sub2)
            writeFileSync(path.join(sub1, 'index.ts'), 'export')
            writeFileSync(path.join(sub2, 'index.ts'), 'export')

            const result = generateIndexForDirectory(testRoot, false, ['sub1'])

            expect(result).toContain("export * from './sub2'")
            expect(result).not.toContain('./sub1')
        })
    })

    describe('generateGlobalForDirectory', () => {
        test('returns empty message for directory with no global files', () => {
            writeFileSync(path.join(testRoot, 'module.ts'), 'export const test = 1')

            const result = generateGlobalForDirectory(testRoot)

            expect(result).toContain('No global files found')
        })

        test('includes global.ts from subdirectories', () => {
            const subDir = path.join(testRoot, 'Array')
            mkdirSync(subDir)
            writeFileSync(path.join(subDir, 'global.ts'), 'declare global {}')

            const result = generateGlobalForDirectory(testRoot)

            expect(result).toContain("import './Array/global'")
        })

        test('includes .global.* files from current directory', () => {
            writeFileSync(path.join(testRoot, 'Array.global.ts'), 'declare global {}')

            const result = generateGlobalForDirectory(testRoot)

            expect(result).toContain("import './Array.global'")
        })

        test('includes .extension.* files', () => {
            writeFileSync(path.join(testRoot, 'Array.extension.ts'), 'Array.prototype.foo')

            const result = generateGlobalForDirectory(testRoot)

            expect(result).toContain("import './Array.extension'")
        })

        test('sorts imports alphabetically', () => {
            writeFileSync(path.join(testRoot, 'zeta.global.ts'), 'global')
            writeFileSync(path.join(testRoot, 'alpha.global.ts'), 'global')

            const result = generateGlobalForDirectory(testRoot)

            const alphaIndex = result.indexOf('alpha')
            const zetaIndex = result.indexOf('zeta')

            expect(alphaIndex).toBeLessThan(zetaIndex)
        })

        test('skips directories in separateModules', () => {
            const sub1 = path.join(testRoot, 'sub1')
            const sub2 = path.join(testRoot, 'sub2')
            mkdirSync(sub1)
            mkdirSync(sub2)
            writeFileSync(path.join(sub1, 'global.ts'), 'global')
            writeFileSync(path.join(sub2, 'global.ts'), 'global')

            const result = generateGlobalForDirectory(testRoot, ['sub1'])

            expect(result).toContain('./sub2/global')
            expect(result).not.toContain('./sub1')
        })
    })
})
