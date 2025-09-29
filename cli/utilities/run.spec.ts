import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { execSync, spawn } from 'child_process'
import run, { runState } from './run'

vi.mock('child_process')

const mockSpawn = vi.mocked(spawn)
const mockExecSync = vi.mocked(execSync)

describe('run', () => {
    let mockChildProcess: {
        addListener: ReturnType<typeof vi.fn>
        pid: number
    }

    beforeEach(() => {
        mockChildProcess = {
            addListener: vi.fn(),
            pid: 12345
        }
        mockSpawn.mockReturnValue(mockChildProcess as any)
        mockExecSync.mockImplementation(() => Buffer.from(''))
    })

    afterEach(() => {
        vi.clearAllMocks()
        delete runState.restart
    })

    it('should parse command string correctly', async () => {
        const promise = run('npm run dev')

        const exitCallback = mockChildProcess.addListener.mock.calls.find(
            call => call[0] === 'exit'
        )?.[1]

        exitCallback?.()
        await promise

        expect(mockSpawn).toHaveBeenCalledWith('npm', ['run', 'dev'], expect.objectContaining({
            stdio: 'inherit',
            signal: expect.any(AbortSignal)
        }))
    })

    it('should handle quoted arguments', async () => {
        const promise = run('echo "hello world" \'single quotes\'')

        const exitCallback = mockChildProcess.addListener.mock.calls.find(
            call => call[0] === 'exit'
        )?.[1]

        exitCallback?.()
        await promise

        expect(mockSpawn).toHaveBeenCalledWith('echo', ['hello world', 'single quotes'], expect.any(Object))
    })

    it('should throw error for invalid command', async () => {
        expect(() => run('')).toThrow('run: bad command')
    })

    it('should set restart function in runState', () => {
        run('test command')

        expect(runState.restart).toBeDefined()
        expect(typeof runState.restart).toBe('function')
    })

    it('should handle process restart', async () => {
        const promise = run('test command')

        expect(runState.restart).toBeDefined()

        // Call restart
        runState.restart?.()

        // Simulate exit to trigger restart
        const exitCallback = mockChildProcess.addListener.mock.calls.find(
            call => call[0] === 'exit'
        )?.[1]

        exitCallback?.()

        expect(mockExecSync).toHaveBeenCalledWith('./cli/lib/shutdown.sh')
    })

    it('should pass parameters to spawn', async () => {
        const options = { cwd: '/custom/path' }
        const promise = run('test command', options)

        const exitCallback = mockChildProcess.addListener.mock.calls.find(
            call => call[0] === 'exit'
        )?.[1]

        exitCallback?.()
        await promise

        expect(mockSpawn).toHaveBeenCalledWith('test', ['command'], expect.objectContaining(options))
    })

    it('should handle error event when not restarting', () => {
        run('test command')

        const errorCallback = mockChildProcess.addListener.mock.calls.find(
            call => call[0] === 'error'
        )?.[1]

        expect(() => errorCallback?.(new Error('test error'))).toThrow('error')
    })

    it('should not throw error when restarting', () => {
        const promise = run('test command')

        // Trigger restart
        runState.restart?.()

        const errorCallback = mockChildProcess.addListener.mock.calls.find(
            call => call[0] === 'error'
        )?.[1]

        expect(() => errorCallback?.(new Error('test error'))).not.toThrow()

        // Clean up
        const exitCallback = mockChildProcess.addListener.mock.calls.find(
            call => call[0] === 'exit'
        )?.[1]
        exitCallback?.()

        return promise
    })
})