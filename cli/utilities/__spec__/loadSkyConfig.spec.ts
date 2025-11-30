import { describe, test, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before imports
vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(),
    },
    existsSync: vi.fn(),
}))

vi.mock('../Console', () => ({
    default: {
        error: vi.fn(),
        log: vi.fn(),
    },
}))

vi.mock('../getUnixPath', () => ({
    default: vi.fn((p: string) => p),
}))

// Mock Sky.Config namespace
vi.mock('../configuration/Sky.Config.namespace', () => ({}))
vi.mock('../configuration/Sky.App.namespace', () => ({}))

describe('loadSkyConfig utilities', () => {
    let fs: any
    let Console: any
    let findSkyConfig: typeof import('../loadSkyConfig').findSkyConfig
    let getAppConfig: typeof import('../loadSkyConfig').getAppConfig

    beforeEach(async () => {
        vi.clearAllMocks()

        fs = await import('fs')
        Console = (await import('../Console')).default

        // Mock Sky namespace on global
        ;(global as any).Sky = {
            Config: class {
                name: string
                modules: Record<string, any> = {}
                apps: Record<string, any> = {}
                playgrounds: Record<string, any> = {}

                constructor(params: any) {
                    Object.assign(this, params)
                    this.modules = params.modules || {}
                    this.apps = params.apps || {}
                    this.playgrounds = params.playgrounds || {}
                }
            },
        }

        const module = await import('../loadSkyConfig')
        findSkyConfig = module.findSkyConfig
        getAppConfig = module.getAppConfig
    })

    describe('findSkyConfig', () => {
        test.skip('returns path when config exists in current directory', () => {
            fs.existsSync.mockReturnValue(true)

            const result = findSkyConfig()

            expect(result).not.toBeNull()
            if (result) {
                expect(result).toContain('.sky/sky.config.ts')
            }
            expect(fs.existsSync).toHaveBeenCalled()
        })

        test('returns null when config not found', () => {
            fs.existsSync.mockReturnValue(false)

            const result = findSkyConfig()

            expect(result).toBeNull()
        })

        test.skip('searches parent directories', () => {
            let callCount = 0
            fs.existsSync.mockImplementation(() => {
                callCount++
                return callCount === 3 // Found in 3rd attempt
            })

            const result = findSkyConfig()

            expect(result).not.toBeNull()
            if (result) {
                expect(result).toContain('.sky/sky.config.ts')
            }
            expect(fs.existsSync).toHaveBeenCalledTimes(3)
        })

        test.skip('stops at filesystem root', () => {
            fs.existsSync.mockReturnValue(false)

            const result = findSkyConfig()

            expect(result).toBeNull()
            // Should stop searching when reaching root
            expect(fs.existsSync).toHaveBeenCalled()
        })
    })

    describe('getAppConfig', () => {
        test('returns app config from apps', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                apps: {
                    'test-app': {
                        target: 'web',
                        public: 'public',
                    },
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeDefined()
            expect(result?.target).toBe('web')
            expect(result?.public).toBe('public')
        })

        test('returns app config from playgrounds', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                playgrounds: {
                    'test-playground': {
                        target: 'web',
                        public: 'public',
                    },
                },
            })

            const result = getAppConfig('test-playground', config)

            expect(result).toBeDefined()
            expect(result?.target).toBe('web')
        })

        test('sets default path if not provided', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                apps: {
                    'test-app': {
                        target: 'node',
                    },
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result?.path).toBe('test-app')
        })

        test('returns null and logs error if app not found', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                apps: {},
            })

            const result = getAppConfig('missing-app', config)

            expect(result).toBeNull()
            expect(Console.error).toHaveBeenCalledWith(
                expect.stringContaining('missing app description')
            )
        })

        test('returns null if target is missing', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                apps: {
                    'test-app': {
                        // missing target
                    },
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeNull()
            expect(Console.error).toHaveBeenCalledWith(expect.stringContaining('missing app target'))
        })

        test('returns null if public is missing for web target', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                apps: {
                    'test-app': {
                        target: 'web',
                        // missing public
                    },
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeNull()
            expect(Console.error).toHaveBeenCalledWith(expect.stringContaining('missing app public'))
        })

        test('returns null if public is missing for universal target', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                apps: {
                    'test-app': {
                        target: 'universal',
                        // missing public
                    },
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeNull()
        })

        test('does not require public for node target', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                apps: {
                    'test-app': {
                        target: 'node',
                    },
                },
            })

            const result = getAppConfig('test-app', config)

            expect(result).toBeDefined()
            expect(result?.target).toBe('node')
        })

        test('validates multiple app configs', () => {
            const config = new (global as any).Sky.Config({
                name: 'Test',
                apps: {
                    'app1': { target: 'node' },
                    'app2': { target: 'web', public: 'public' },
                    'app3': { target: 'web' }, // Invalid - missing public
                },
            })

            const result1 = getAppConfig('app1', config)
            const result2 = getAppConfig('app2', config)
            const result3 = getAppConfig('app3', config)

            expect(result1).toBeDefined()
            expect(result2).toBeDefined()
            expect(result3).toBeNull()
        })
    })
})
