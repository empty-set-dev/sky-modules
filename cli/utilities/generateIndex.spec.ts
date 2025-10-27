import { describe, test, expect, vi, beforeEach } from 'vitest'
import { join } from 'path'

// Mock dependencies before imports
vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(),
        readFileSync: vi.fn(),
        readdirSync: vi.fn(),
        statSync: vi.fn(),
    },
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
    statSync: vi.fn(),
}))

vi.mock('./Console', () => ({
    default: {
        warn: vi.fn(),
        error: vi.fn(),
        log: vi.fn(),
    },
}))

vi.mock('./workspaceRoot', () => ({
    default: '/test/workspace',
}))

vi.mock('./generateGlobalFile', async (importOriginal) => {
    const actual = await importOriginal<typeof import('./generateGlobalFile')>()
    return {
        getDefaultExportInfo: vi.fn(() => ({ isTypeOnly: false })),
        getDefaultExportName: actual.getDefaultExportName,
    }
})

describe('generateIndex', () => {
    let fs: any
    let Console: any
    let getDefaultExportInfo: any
    let generateIndex: typeof import('./generateIndex').default

    beforeEach(async () => {
        vi.clearAllMocks()

        fs = await import('fs')
        Console = (await import('./Console')).default
        getDefaultExportInfo = (await import('./generateGlobalFile')).getDefaultExportInfo

        const module = await import('./generateIndex')
        generateIndex = module.default
    })

    describe('basic functionality', () => {
        test('generates index from slice.json with simple modules', () => {
            // Mock slice.json exists
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.includes('/test-module.ts')) return true
                if (path.includes('/another-module.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({
                        name: '@sky-modules/test',
                        modules: ['test-module', 'another-module'],
                    })
                }
                if (path.includes('test-module.ts')) {
                    return 'export default function testModule() {}'
                }
                if (path.includes('another-module.ts')) {
                    return 'export const anotherModule = () => {}'
                }
                return ''
            })

            const result = generateIndex('test-path')

            expect(result).toContain('// Auto-generated index file')
            // Should use actual function name (testModule), not sanitized filename (test_module)
            expect(result).toContain('export { default as testModule } from')
            expect(result).toContain("export * from './another-module'")
        })

        test('generates index from module.json', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('module.json')) return true
                if (path.includes('/my-module.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('module.json')) {
                    return JSON.stringify({
                        modules: ['my-module'],
                    })
                }
                if (path.includes('my-module.ts')) {
                    return 'export const myModule = true'
                }
                return ''
            })

            const result = generateIndex('test-path')

            expect(result).toContain('// Generated from module.json configuration')
            expect(result).toContain("export * from './my-module'")
        })

        test('throws error when no config found', () => {
            fs.existsSync.mockReturnValue(false)

            expect(() => generateIndex('no-config-path')).toThrow(
                'No slice.json or module.json found'
            )
        })

        test('throws error when no modules specified', () => {
            fs.existsSync.mockImplementation((path: string) => {
                return path.includes('slice.json')
            })

            fs.readFileSync.mockImplementation(() => {
                return JSON.stringify({
                    name: '@sky-modules/test',
                    modules: [],
                })
            })

            expect(() => generateIndex('test-path')).toThrow('No modules specified')
        })

        test('throws error when no valid modules found', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                return false // Module doesn't exist
            })

            fs.readFileSync.mockImplementation(() => {
                return JSON.stringify({
                    name: '@sky-modules/test',
                    modules: ['nonexistent-module'],
                })
            })

            expect(() => generateIndex('test-path')).toThrow('No valid modules found')
        })
    })

    describe('module file detection', () => {
        test('finds module with .ts extension', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.endsWith('.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['module'] })
                }
                return 'export default function module() {}'
            })

            const result = generateIndex('test')

            expect(result).toContain("export { default as module } from './module'")
        })

        test('finds module with .tsx extension', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.endsWith('.tsx')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['Component'] })
                }
                return 'export default function Component() { return <div/> }'
            })

            const result = generateIndex('test')

            expect(result).toContain("export { default as Component } from './Component'")
        })

        test('finds module with .js extension', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.endsWith('.ts') || path.endsWith('.tsx')) return false
                if (path.endsWith('.js')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['legacy'] })
                }
                return 'export default function legacy() {}'
            })

            const result = generateIndex('test')

            expect(result).toContain("export { default as legacy } from './legacy'")
        })

        test('warns when module not found but continues if others exist', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.includes('valid-module.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['missing-module', 'valid-module'] })
                }
                return 'export const valid = true'
            })

            generateIndex('test')

            expect(Console.warn).toHaveBeenCalledWith(
                expect.stringContaining('Module missing-module not found')
            )
        })
    })

    describe('export type detection', () => {
        test('generates both default and named exports', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.endsWith('.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['module'] })
                }
                return 'export default function module() {}\nexport const helper = true'
            })

            const result = generateIndex('test')

            expect(result).toContain("export { default as module } from './module'")
            expect(result).toContain("export * from './module'")
        })

        test('generates only default export when no named exports', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.endsWith('.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['module'] })
                }
                return 'export default function module() {}'
            })

            const result = generateIndex('test')

            expect(result).toContain("export { default as module } from './module'")
            expect(result).not.toContain("export * from './module'")
        })

        test('generates only named exports when no default', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.endsWith('.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['module'] })
                }
                return 'export const helper = true'
            })

            const result = generateIndex('test')

            expect(result).not.toContain('export { default')
            expect(result).toContain("export * from './module'")
        })

        test('generates type-only export for type-only default', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.endsWith('.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['Types'] })
                }
                return 'export default type Types = {}'
            })

            getDefaultExportInfo.mockReturnValue({ isTypeOnly: true })

            const result = generateIndex('test')

            expect(result).toContain("export type { default as Types } from './Types'")
        })
    })

    describe('directory modules', () => {
        test('handles module directory with index file', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.includes('/Module')) return true
                if (path.includes('Module/index.ts')) return true
                return false
            })

            fs.statSync.mockImplementation((path: string) => {
                if (path.includes('/Module') && !path.includes('/Module/')) {
                    return { isDirectory: () => true }
                }
                return { isDirectory: () => false }
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['Module'] })
                }
                return 'export default function Module() {}'
            })

            getDefaultExportInfo.mockReturnValue({ isTypeOnly: false })

            const result = generateIndex('test')

            expect(result).toContain("export { default as Module } from './Module'")
        })

        test('handles module directory without index file', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.includes('/Module') && !path.includes('index')) return true
                return false
            })

            fs.statSync.mockImplementation((path: string) => {
                if (path.includes('/Module') && !path.includes('/Module/')) {
                    return { isDirectory: () => true }
                }
                return { isDirectory: () => false }
            })

            fs.readdirSync.mockReturnValue(['helper.ts', 'utils.ts'])

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['Module'] })
                }
                return 'export const helper = true'
            })

            const result = generateIndex('test')

            expect(result).toContain("export * from './Module'")
        })
    })

    describe('identifier conversion', () => {
        test('uses actual function name instead of sanitized filename', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.includes('my-module.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['my-module'] })
                }
                return 'export default function myModule() {}'
            })

            getDefaultExportInfo.mockReturnValue({ isTypeOnly: false })

            const result = generateIndex('test')

            // Should use actual function name (myModule), not sanitized filename (my_module)
            expect(result).toContain("export { default as myModule } from './my-module'")
        })

        test('uses actual function name from file with dots', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.includes('my.module.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['my.module'] })
                }
                return 'export default function myModule() {}'
            })

            getDefaultExportInfo.mockReturnValue({ isTypeOnly: false })

            const result = generateIndex('test')

            // Should use actual function name (myModule), not sanitized filename (my_module)
            expect(result).toContain("export { default as myModule } from './my.module'")
        })
    })

    describe('special module "." handling', () => {
        test('finds all modules in directory with "." module', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                return false
            })

            fs.readdirSync.mockReturnValue(['module1.ts', 'module2.ts', 'index.ts'])

            fs.statSync.mockImplementation(() => ({
                isDirectory: () => false,
            }))

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['.'] })
                }
                if (path.includes('module1')) {
                    return 'export default function module1() {}'
                }
                if (path.includes('module2')) {
                    return 'export const module2 = true'
                }
                return ''
            })

            getDefaultExportInfo.mockReturnValue({ isTypeOnly: false })

            const result = generateIndex('test')

            expect(result).toContain("export { default as module1 } from './module1'")
            expect(result).toContain("export * from './module2'")
            // index.ts file should be excluded (not exported)
            const exportLines = result.split('\n').filter(line => line.startsWith('export'))
            expect(exportLines.some(line => line.includes('index'))).toBe(false)
        })

        test('excludes test files with "." module', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                return false
            })

            fs.readdirSync.mockReturnValue([
                'module.ts',
                'module.test.ts',
                'module.spec.ts',
            ])

            fs.statSync.mockImplementation(() => ({
                isDirectory: () => false,
            }))

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['.'] })
                }
                return 'export const module = true'
            })

            const result = generateIndex('test')

            expect(result).toContain("export * from './module'")
            expect(result).not.toContain('.test.')
            expect(result).not.toContain('.spec.')
        })

        test('excludes example and lite files with "." module', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                return false
            })

            fs.readdirSync.mockReturnValue([
                'module.ts',
                'module.example.ts',
                'Component.lite.tsx',
            ])

            fs.statSync.mockImplementation(() => ({
                isDirectory: () => false,
            }))

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['.'] })
                }
                return 'export const module = true'
            })

            const result = generateIndex('test')

            expect(result).toContain("export * from './module'")
            expect(result).not.toContain('example')
            expect(result).not.toContain('lite')
        })

        test('excludes global files with "." module', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                return false
            })

            fs.readdirSync.mockReturnValue(['module.ts', 'global.ts', 'Array.global.ts'])

            fs.statSync.mockImplementation(() => ({
                isDirectory: () => false,
            }))

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['.'] })
                }
                return 'export const module = true'
            })

            const result = generateIndex('test')

            expect(result).toContain("export * from './module'")
            expect(result).not.toContain('global')
        })

        test('respects separateModules with "." module', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                return false
            })

            fs.readdirSync.mockReturnValue(['module1.ts', 'module2.ts', 'separate.ts'])

            fs.statSync.mockImplementation(() => ({
                isDirectory: () => false,
            }))

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({
                        modules: ['.'],
                        separateModules: ['separate'],
                    })
                }
                return 'export const value = true'
            })

            const result = generateIndex('test')

            expect(result).toContain("export * from './module1'")
            expect(result).toContain("export * from './module2'")
            expect(result).not.toContain('separate')
        })

        test('handles directories with "." module', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.includes('Module/index.ts')) return true
                return false
            })

            fs.readdirSync.mockReturnValue(['Module', 'file.ts'])

            fs.statSync.mockImplementation((path: string) => {
                if (path.includes('/Module') && !path.includes('/Module/')) {
                    return { isDirectory: () => true }
                }
                return { isDirectory: () => false }
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['.'] })
                }
                if (path.includes('Module')) {
                    return 'export default function Module() {}'
                }
                return 'export const file = true'
            })

            getDefaultExportInfo.mockReturnValue({ isTypeOnly: false })

            const result = generateIndex('test')

            expect(result).toContain("export { default as Module } from './Module'")
            expect(result).toContain("export * from './file'")
        })

        test('prefers directory over file with same basename', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.includes('Module/index.ts')) return true
                return false
            })

            fs.readdirSync.mockReturnValue(['Module', 'Module.ts'])

            fs.statSync.mockImplementation((path: string) => {
                if (path.includes('/Module') && !path.includes('/Module.ts')) {
                    return { isDirectory: () => true }
                }
                return { isDirectory: () => false }
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['.'] })
                }
                return 'export default function Module() {}'
            })

            getDefaultExportInfo.mockReturnValue({ isTypeOnly: false })

            const result = generateIndex('test')

            // Should only have one Module export (from directory, not file)
            // Count export statements for Module, not total occurrences
            const exportLines = result.split('\n').filter(line =>
                line.includes("from './Module'")
            )
            expect(exportLines.length).toBe(1)
        })
    })

    describe('header generation', () => {
        test('includes correct header for slice', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) return true
                if (path.endsWith('.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('slice.json')) {
                    return JSON.stringify({ modules: ['module'] })
                }
                return 'export const module = true'
            })

            const result = generateIndex('core/test')

            expect(result).toContain('// Auto-generated index file for @sky-modules/core/test')
            expect(result).toContain('// Generated from slice.json configuration')
        })

        test('includes correct header for module', () => {
            fs.existsSync.mockImplementation((path: string) => {
                if (path.includes('module.json')) return true
                if (path.endsWith('.ts')) return true
                return false
            })

            fs.readFileSync.mockImplementation((path: string) => {
                if (path.includes('module.json')) {
                    return JSON.stringify({ modules: ['module'] })
                }
                return 'export const module = true'
            })

            const result = generateIndex('test-module')

            expect(result).toContain('// Generated from module.json configuration')
        })
    })
})
