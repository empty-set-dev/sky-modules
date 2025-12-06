import { describe, test, expect } from 'vitest'

describe('discoverConfigs', () => {
    // These tests verify the real config discovery
    // Integration tests with test workspaces are in e2e tests

    test('exports discoverAllConfigs function', async () => {
        const module = await import('../discoverConfigs')
        expect(module.discoverAllConfigs).toBeDefined()
        expect(typeof module.discoverAllConfigs).toBe('function')
    })

    test('discoverAllConfigs returns Maps', async () => {
        const module = await import('../discoverConfigs')
        const result = await module.discoverAllConfigs()

        expect(result).toHaveProperty('modules')
        expect(result).toHaveProperty('apps')
        expect(result.modules).toBeInstanceOf(Map)
        expect(result.apps).toBeInstanceOf(Map)
    })

    test('discovered modules have required structure', async () => {
        const module = await import('../discoverConfigs')
        const { modules } = await module.discoverAllConfigs()

        // Check if any modules were discovered
        if (modules.size > 0) {
            const firstModule = modules.values().next().value

            expect(firstModule).toHaveProperty('path')
            expect(firstModule).toHaveProperty('config')
            expect(firstModule.config).toHaveProperty('id')
            expect(typeof firstModule.path).toBe('string')
            expect(typeof firstModule.config.id).toBe('string')
        }
    })

    test('discovered apps have required structure', async () => {
        const module = await import('../discoverConfigs')
        const { apps } = await module.discoverAllConfigs()

        // Check if any apps were discovered
        if (apps.size > 0) {
            const firstApp = apps.values().next().value

            expect(firstApp).toHaveProperty('path')
            expect(firstApp).toHaveProperty('config')
            expect(firstApp.config).toHaveProperty('id')
            expect(firstApp.config).toHaveProperty('target')
            expect(typeof firstApp.path).toBe('string')
            expect(typeof firstApp.config.id).toBe('string')
        }
    })

    test('module paths are relative to workspace root', async () => {
        const module = await import('../discoverConfigs')
        const { modules } = await module.discoverAllConfigs()

        for (const [key, discoveredModule] of modules.entries()) {
            // Key should match path
            expect(key).toBe(discoveredModule.path)

            // Path should not start with /
            expect(discoveredModule.path.startsWith('/')).toBe(false)
        }
    })

    test('app paths are relative to workspace root', async () => {
        const module = await import('../discoverConfigs')
        const { apps } = await module.discoverAllConfigs()

        for (const [key, discoveredApp] of apps.entries()) {
            // Key should match path
            expect(key).toBe(discoveredApp.path)

            // Path should not start with /
            expect(discoveredApp.path.startsWith('/')).toBe(false)
        }
    })

    test('module configs have valid package names', async () => {
        const module = await import('../discoverConfigs')
        const { modules } = await module.discoverAllConfigs()

        for (const discoveredModule of modules.values()) {
            if (discoveredModule.config.package) {
                // Package name should start with @ or be a simple name
                expect(
                    discoveredModule.config.package.startsWith('@') ||
                        !discoveredModule.config.package.includes('/')
                ).toBe(true)
            }
        }
    })

    test('app configs have valid targets', async () => {
        const module = await import('../discoverConfigs')
        const { apps } = await module.discoverAllConfigs()

        const validTargets = ['web', 'node', 'universal', 'ios', 'android', 'desktop']

        for (const discoveredApp of apps.values()) {
            expect(validTargets).toContain(discoveredApp.config.target)
        }
    })
})
