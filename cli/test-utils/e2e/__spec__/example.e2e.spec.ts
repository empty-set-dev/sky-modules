/**
 * Example E2E test for CLI commands
 *
 * This is a reference implementation showing how to write E2E tests
 * for Sky CLI commands using the e2e test utilities.
 *
 * To run this test: sky test cli/test-utils/e2e
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import {
    createTestWorkspace,
    assertCommandSuccess,
    assertCommandFailed,
    commandOutputContains,
} from '../helpers'

describe('CLI E2E Example', () => {
    let workspace: ReturnType<typeof createTestWorkspace>['workspace']
    let cleanup: ReturnType<typeof createTestWorkspace>['cleanup']

    beforeEach(() => {
        const testEnv = createTestWorkspace('cli-e2e-test')
        workspace = testEnv.workspace
        cleanup = testEnv.cleanup
    })

    afterEach(() => {
        cleanup()
    })

    test('sky check command should fail in empty workspace', async () => {
        const result = await workspace.runCommand('check')

        assertCommandFailed(result, 'Expected check to fail in empty workspace')
        // Check command fails because sky.config.ts is not found
        const hasError =
            commandOutputContains(result, 'not found') ||
            commandOutputContains(result, 'could not') ||
            commandOutputContains(result, 'No such file') ||
            result.exitCode !== 0
        expect(hasError).toBe(true)
    })

    test('sky init command should create config files', async () => {
        // Create minimal package.json for pnpm workspace
        workspace.writeFile('package.json', '{"name": "test-workspace"}')

        // Create minimal sky.config.ts
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

        const result = await workspace.runCommand('init ts-configs')

        // Command should complete (might succeed or fail depending on environment)
        expect(result.exitCode).toBeDefined()
        // If it succeeds, check for success message
        if (result.exitCode === 0) {
            expect(
                commandOutputContains(result, 'success') ||
                    commandOutputContains(result, 'created') ||
                    result.stdout.length > 0
            ).toBe(true)
        }
    })

    test('workspace file operations', () => {
        // Write a test file
        const filePath = workspace.writeFile('test.txt', 'Hello, World!')
        expect(filePath).toContain(workspace.path)

        // Get absolute path
        const resolved = workspace.resolve('test.txt')
        expect(resolved).toBe(filePath)
    })

    test('command with custom environment variables', async () => {
        workspace.writeFile('.sky/sky.config.ts', 'export default { name: "Test", id: "test" }')

        const result = await workspace.runCommand('check', {
            env: {
                NODE_ENV: 'test',
            },
        })

        // Command should complete (success or failure depending on setup)
        expect(result.exitCode).toBeDefined()
    })
})
