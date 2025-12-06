import { describe, test, expect } from 'vitest'

describe('loadWorkspaceConfig', () => {
    // These tests verify the real workspace config loading
    // Integration tests are in e2e tests

    test('exports loadWorkspaceConfig function', async () => {
        const module = await import('../loadWorkspaceConfig')
        expect(module.loadWorkspaceConfig).toBeDefined()
        expect(typeof module.loadWorkspaceConfig).toBe('function')
    })

    test('exports findWorkspaceConfig function', async () => {
        const module = await import('../loadWorkspaceConfig')
        expect(module.findWorkspaceConfig).toBeDefined()
        expect(typeof module.findWorkspaceConfig).toBe('function')
    })

    test('exports getWorkspaceRoot function', async () => {
        const module = await import('../loadWorkspaceConfig')
        expect(module.getWorkspaceRoot).toBeDefined()
        expect(typeof module.getWorkspaceRoot).toBe('function')
    })

    test('loadWorkspaceConfig returns workspace config or null', async () => {
        const module = await import('../loadWorkspaceConfig')
        const config = await module.loadWorkspaceConfig()

        // Config might be null if not in workspace, or valid workspace config
        if (config !== null) {
            expect(config).toHaveProperty('name')
            expect(config).toHaveProperty('id')
            expect(typeof config.name).toBe('string')
            expect(typeof config.id).toBe('string')
        }
    })

    test('findWorkspaceConfig returns path or null', async () => {
        const module = await import('../loadWorkspaceConfig')
        const configPath = module.findWorkspaceConfig()

        if (configPath !== null) {
            expect(typeof configPath).toBe('string')
            expect(configPath).toContain('sky-workspace.config.ts')
        }
    })

    test('getWorkspaceRoot returns path or null', async () => {
        const module = await import('../loadWorkspaceConfig')
        const root = module.getWorkspaceRoot()

        if (root !== null) {
            expect(typeof root).toBe('string')
            expect(root.length).toBeGreaterThan(0)
        }
    })

    test('getWorkspaceRoot matches findWorkspaceConfig directory', async () => {
        const module = await import('../loadWorkspaceConfig')
        const configPath = module.findWorkspaceConfig()
        const root = module.getWorkspaceRoot()

        // Both should be null or both should be non-null
        if (configPath === null) {
            expect(root).toBeNull()
        } else {
            expect(root).not.toBeNull()
            expect(configPath).toContain(root!)
        }
    })
})
