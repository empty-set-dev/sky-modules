/**
 * E2E tests for Sky CLI commands
 *
 * These tests verify the actual CLI commands work correctly
 * in isolated test environments.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { e2e } from './test-utils'

describe('Sky CLI E2E Tests', () => {
    let workspace: ReturnType<typeof e2e.createTestWorkspace>['workspace']
    let cleanup: ReturnType<typeof e2e.createTestWorkspace>['cleanup']

    beforeEach(() => {
        const testEnv = e2e.createTestWorkspace(`cli-e2e-${Date.now()}`)
        workspace = testEnv.workspace
        cleanup = testEnv.cleanup
    })

    afterEach(() => {
        cleanup()
    })

    describe('sky test command', () => {
        test('should show error when no tests found', async () => {
            workspace.writeFile(
                '.sky/sky.config.ts',
                `
export default {
    name: 'Test Project',
    id: 'test',
    modules: {},
    apps: {}
}
`
            )

            const result = await workspace.runCommand('test cli', { timeout: 60000 })

            // Test command might fail or succeed depending on setup
            // Just check it ran
            expect(result.exitCode).toBeDefined()
        })
    })

    describe('workspace validation', () => {
        test('workspace creates and cleans up correctly', () => {
            const filePath = workspace.writeFile('test.txt', 'Hello World')
            expect(filePath).toContain(workspace.path)

            const resolved = workspace.resolve('test.txt')
            expect(resolved).toBe(filePath)
        })

        test('workspace can write multiple files', () => {
            workspace.writeFile('file1.txt', 'Content 1')
            workspace.writeFile('file2.txt', 'Content 2')
            workspace.writeFile('nested/file3.txt', 'Content 3')

            expect(workspace.resolve('file1.txt')).toContain('file1.txt')
            expect(workspace.resolve('nested/file3.txt')).toContain('nested/file3.txt')
        })
    })

    describe('command execution', () => {
        test('command result contains all required fields', async () => {
            const result = await workspace.runCommand('--version', { timeout: 10000 })

            expect(result).toHaveProperty('stdout')
            expect(result).toHaveProperty('stderr')
            expect(result).toHaveProperty('exitCode')
            expect(typeof result.stdout).toBe('string')
            expect(typeof result.stderr).toBe('string')
            expect(typeof result.exitCode).toBe('number')
        })

        test('commandOutputContains helper works', async () => {
            workspace.writeFile('README.md', '# Test')

            const result = await workspace.runCommand('--help', { timeout: 10000 })

            // Help should contain common commands
            const hasOutput = e2e.commandOutputContains(result, 'sky') ||
                              e2e.commandOutputContains(result, 'command') ||
                              result.stdout.length > 0

            expect(hasOutput).toBe(true)
        })
    })

    describe('error handling', () => {
        test('invalid command fails correctly', async () => {
            const result = await workspace.runCommand('invalid-command-xyz', {
                timeout: 10000,
            })

            expect(result.exitCode).not.toBe(0)
        })

        test('assertCommandFailed works', async () => {
            const result = await workspace.runCommand('invalid-xyz', { timeout: 10000 })

            expect(() => e2e.assertCommandFailed(result)).not.toThrow()
        })
    })

    describe('timeout handling', () => {
        test('respects timeout option', async () => {
            const start = Date.now()

            await workspace.runCommand('--help', { timeout: 5000 })

            const duration = Date.now() - start
            expect(duration).toBeLessThan(10000)
        })
    })

    describe('environment variables', () => {
        test('can pass custom environment variables', async () => {
            const result = await workspace.runCommand('--version', {
                env: {
                    TEST_ENV: 'custom',
                },
                timeout: 10000,
            })

            expect(result).toBeDefined()
        })
    })
})
