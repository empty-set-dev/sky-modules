import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from 'fs'
import test from './test'
import runShell from './utilities/run'

vi.mock('fs')
vi.mock('./utilities/run')
vi.mock('./utilities/cliPath', () => ({
    default: '/mock/cli/path'
}))
vi.mock('./utilities/workspaceRoot', () => ({
    default: '/mock/sky/path'
}))

const mockReadFileSync = vi.mocked(readFileSync)
const mockWriteFileSync = vi.mocked(writeFileSync)
const mockRmSync = vi.mocked(rmSync)
const mockExistsSync = vi.mocked(existsSync)
const mockMkdirSync = vi.mocked(mkdirSync)
const mockRunShell = vi.mocked(runShell)

describe('test', () => {
    beforeEach(() => {
        mockReadFileSync.mockReturnValue(JSON.stringify({
            testRunner: 'default',
            plugins: []
        }))
        mockRunShell.mockResolvedValue(undefined)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should run vitest without mutation testing', async () => {
        await test({ folder: 'src', _: [], $0: 'test' })

        expect(mockRunShell).toHaveBeenCalledWith(
            'vitest run --config /mock/cli/path/dev-configs/vitest.config.js src'
        )
    })

    it('should run vitest with default folder', async () => {
        await test({ _: [], $0: 'test' })

        expect(mockRunShell).toHaveBeenCalledWith(
            'vitest run --config /mock/cli/path/dev-configs/vitest.config.js .'
        )
    })

    it('should run mutation testing for specific folder', async () => {
        mockExistsSync.mockReturnValue(true)

        await test({ mutation: true, folder: 'src', _: [], $0: 'test' })

        expect(mockRmSync).toHaveBeenCalledWith('/mock/sky/path/.dev/.stryker-tmp', {
            recursive: true,
            force: true,
        })
        expect(mockMkdirSync).toHaveBeenCalledWith('/mock/sky/path/.dev/.stryker-tmp', {
            recursive: true,
        })
        expect(mockWriteFileSync).toHaveBeenCalled()
        expect(mockRunShell).toHaveBeenCalledWith(expect.stringContaining('stryker run'))
    })

    it('should run mutation testing for root folder', async () => {
        await test({ mutation: true, folder: '.', _: [], $0: 'test' })

        expect(mockRunShell).toHaveBeenCalledWith(
            'stryker run /mock/cli/path/dev-configs/stryker.config.json'
        )
    })

    it('should generate correct stryker config', async () => {
        mockExistsSync.mockReturnValue(false)

        await test({ mutation: true, folder: 'src', _: [], $0: 'test' })

        expect(mockMkdirSync).toHaveBeenCalledWith('/mock/sky/path/.dev/.stryker-tmp', {
            recursive: true,
        })

        const writeCall = mockWriteFileSync.mock.calls[0]
        expect(writeCall[0]).toContain('.stryker-tmp/stryker.config.json')

        const config = JSON.parse(writeCall[1] as string)
        expect(config.testRunner).toBe('vitest')
        expect(config.plugins).toContain('@stryker-mutator/vitest-runner')
        expect(config.mutate).toContain('src/**/*.ts')
        expect(config.mutate).toContain('!src/**/*.test.*')
        expect(config.mutate).toContain('!src/**/*.spec.*')
    })

    it('should handle existing sandbox directory', async () => {
        mockExistsSync.mockReturnValue(true)

        await test({ mutation: true, folder: 'src', _: [], $0: 'test' })

        expect(mockRmSync).toHaveBeenCalledWith('/mock/sky/path/.dev/.stryker-tmp', {
            recursive: true,
            force: true,
        })
        expect(mockMkdirSync).toHaveBeenCalledWith('/mock/sky/path/.dev/.stryker-tmp', {
            recursive: true,
        })
    })
})