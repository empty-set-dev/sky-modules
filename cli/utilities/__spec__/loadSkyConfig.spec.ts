import { describe, test, expect, vi, beforeEach } from 'vitest'
import type { SkyConfig } from '../loadSkyConfig'

// Mock dependencies before imports
vi.mock('../Console', () => ({
    default: {
        error: vi.fn(),
        log: vi.fn(),
        warn: vi.fn(),
    },
}))

describe('loadSkyConfig utilities', () => {
    let Console: any
    let getAppConfig: typeof import('../loadSkyConfig').getAppConfig
    let getModuleConfig: typeof import('../loadSkyConfig').getModuleConfig
    let getModuleOrAppConfig: typeof import('../loadSkyConfig').getModuleOrAppConfig

    beforeEach(async () => {
        vi.clearAllMocks()

        Console = (await import('../Console')).default

        const module = await import('../loadSkyConfig')
        getAppConfig = module.getAppConfig
        getModuleConfig = module.getModuleConfig
        getModuleOrAppConfig = module.getModuleOrAppConfig
    })

    function createMockConfig(
        apps: Record<string, Sky.App> = {},
        modules: Record<string, Sky.Module> = {}
    ): SkyConfig {
        return {
            workspace: {
                name: 'Test Workspace',
                id: 'test',
            },
            apps: new Map(Object.entries(apps)),
            modules: new Map(Object.entries(modules)),
        }
    }

    describe('getModuleConfig', () => {
        test('returns module config when found', () => {
            const config = createMockConfig({}, {
                core: {
                    id: 'sky.core',
                    package: '@sky-modules/core',
                    path: 'core',
                },
            })

            const result = getModuleConfig('core', config)

            expect(result).toBeDefined()
            expect(result?.id).toBe('sky.core')
            expect(result?.package).toBe('@sky-modules/core')
        })

        test('returns null and logs error if module not found', () => {
            const config = createMockConfig()

            const result = getModuleConfig('missing-module', config)

            expect(result).toBeNull()
            expect(Console.error).toHaveBeenCalledWith(
                expect.stringContaining('missing module in workspace')
            )
        })
    })

    describe('getModuleOrAppConfig', () => {
        test('returns module config when found in modules', () => {
            const config = createMockConfig(
                {},
                {
                    core: {
                        id: 'sky.core',
                        package: '@sky-modules/core',
                        path: 'core',
                    },
                }
            )

            const result = getModuleOrAppConfig('core', config)

            expect(result).toBeDefined()
            expect(result?.id).toBe('sky.core')
        })

        test('returns app config when found in apps', () => {
            const config = createMockConfig({
                'test-app': {
                    id: 'test.app',
                    path: 'test-app',
                    target: 'web',
                    public: 'public',
                },
            })

            const result = getModuleOrAppConfig('test-app', config)

            expect(result).toBeDefined()
            expect(result?.id).toBe('test.app')
        })

        test('returns null if not found in both', () => {
            const config = createMockConfig()

            const result = getModuleOrAppConfig('missing', config)

            expect(result).toBeNull()
        })

        test('prefers module over app if both exist with same name', () => {
            const config = createMockConfig(
                {
                    shared: {
                        id: 'app.shared',
                        path: 'shared',
                        target: 'web',
                        public: 'public',
                    },
                },
                {
                    shared: {
                        id: 'module.shared',
                        path: 'shared',
                    },
                }
            )

            const result = getModuleOrAppConfig('shared', config)

            expect(result?.id).toBe('module.shared')
        })
    })

    describe('getAppConfig', () => {
        test('returns app config from apps', () => {
            const config = createMockConfig({
                'test-app': {
                    id: 'test.app',
                    path: 'test-app',
                    target: 'web',
                    public: 'public',
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeDefined()
            expect(result?.target).toBe('web')
            expect(result?.public).toBe('public')
        })

        test('returns null and logs error if app not found', () => {
            const config = createMockConfig()

            const result = getAppConfig('missing-app', config)

            expect(result).toBeNull()
            expect(Console.error).toHaveBeenCalledWith(
                expect.stringContaining('missing app in workspace')
            )
        })

        test('returns null if target is missing', () => {
            const config = createMockConfig({
                'test-app': {
                    id: 'test.app',
                    path: 'test-app',
                    target: undefined as any,
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeNull()
            expect(Console.error).toHaveBeenCalledWith(expect.stringContaining('missing app target'))
        })

        test('returns null if public is missing for web target', () => {
            const config = createMockConfig({
                'test-app': {
                    id: 'test.app',
                    path: 'test-app',
                    target: 'web',
                    // missing public
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeNull()
            expect(Console.error).toHaveBeenCalledWith(expect.stringContaining('missing app public'))
        })

        test('returns null if public is missing for universal target', () => {
            const config = createMockConfig({
                'test-app': {
                    id: 'test.app',
                    path: 'test-app',
                    target: 'universal',
                    // missing public
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeNull()
            expect(Console.error).toHaveBeenCalledWith(expect.stringContaining('missing app public'))
        })

        test('does not require public for node target', () => {
            const config = createMockConfig({
                'test-app': {
                    id: 'test.app',
                    path: 'test-app',
                    target: 'node',
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeDefined()
            expect(result?.target).toBe('node')
        })

        test('validates multiple app configs', () => {
            const config = createMockConfig({
                app1: {
                    id: 'test.app1',
                    path: 'app1',
                    target: 'node',
                },
                app2: {
                    id: 'test.app2',
                    path: 'app2',
                    target: 'web',
                    public: 'public',
                },
                app3: {
                    id: 'test.app3',
                    path: 'app3',
                    target: 'web',
                    // Invalid - missing public
                },
            })

            const result1 = getAppConfig('app1', config)
            const result2 = getAppConfig('app2', config)
            const result3 = getAppConfig('app3', config)

            expect(result1).toBeDefined()
            expect(result2).toBeDefined()
            expect(result3).toBeNull()
        })

        test('works with ios target', () => {
            const config = createMockConfig({
                'ios-app': {
                    id: 'test.ios',
                    path: 'ios-app',
                    target: 'ios',
                },
            })

            const result = getAppConfig('ios-app', config)

            expect(result).toBeDefined()
            expect(result?.target).toBe('ios')
        })

        test('works with android target', () => {
            const config = createMockConfig({
                'android-app': {
                    id: 'test.android',
                    path: 'android-app',
                    target: 'android',
                },
            })

            const result = getAppConfig('android-app', config)

            expect(result).toBeDefined()
            expect(result?.target).toBe('android')
        })
    })
})
