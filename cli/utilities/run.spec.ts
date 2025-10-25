import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ChildProcess } from 'child_process'

// Mock child_process module
vi.mock('child_process', async () => {
    const { EventEmitter } = await import('events')

    class MockChildProcess extends EventEmitter {
        pid = 12345
        killed = false
        stdin = null
        stdout = null
        stderr = null
        stdio: any = []

        kill(signal?: string): boolean {
            this.killed = true
            // Simulate async exit
            setTimeout(() => this.emit('exit', 0, signal), 10)
            return true
        }

        addListener(event: string, listener: (...args: any[]) => void): this {
            return super.addListener(event, listener)
        }
    }

    return {
        exec: vi.fn((cmd: string, cb: (error?: Error) => void) => {
            setTimeout(() => cb(), 10)
        }),
        spawn: vi.fn(() => new MockChildProcess()),
    }
})

vi.mock('../constants', () => ({
    CLI_CONSTANTS: {
        PORT_RELEASE_DELAY_MS: 100,
        RESTART_MIN_DELAY_MS: 500,
    },
    ExitCode: {
        SUCCESS: 0,
        ERROR: 1,
    },
}))

describe('run utility', () => {
    let run: typeof import('./run').default
    let runState: typeof import('./run').runState
    let spawn: any
    let exec: any

    beforeEach(async () => {
        vi.clearAllMocks()

        // Re-import modules to get fresh instances
        const childProcess = await import('child_process')
        spawn = childProcess.spawn
        exec = childProcess.exec

        const runModule = await import('./run')
        run = runModule.default
        runState = runModule.runState
    })

    afterEach(() => {
        vi.clearAllMocks()
        delete runState.restart
    })

    describe('command execution', () => {
        test('executes simple command', async () => {
            const promise = run('echo hello')

            // Trigger exit event
            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(spawn).toHaveBeenCalledWith('echo', ['hello'], expect.any(Object))
        })

        test('parses command with multiple arguments', async () => {
            const promise = run('npm run build --prod')

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(spawn).toHaveBeenCalledWith(
                'npm',
                ['run', 'build', '--prod'],
                expect.any(Object)
            )
        })

        test('handles commands with quoted arguments', async () => {
            const promise = run('echo "hello world" test')

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(spawn).toHaveBeenCalledWith('echo', ['hello world', 'test'], expect.any(Object))
        })

        test('handles commands with single quoted arguments', async () => {
            const promise = run("echo 'hello world' test")

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(spawn).toHaveBeenCalledWith('echo', ['hello world', 'test'], expect.any(Object))
        })

        test('passes spawn options', async () => {
            const options = { cwd: '/test/path', env: { TEST: 'value' } }
            const promise = run('echo test', options)

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(spawn).toHaveBeenCalledWith(
                'echo',
                ['test'],
                expect.objectContaining({
                    stdio: 'inherit',
                    ...options,
                })
            )
        })

        test('resolves when process exits', async () => {
            let resolved = false

            const promise = run('echo test').then(() => {
                resolved = true
            })

            expect(resolved).toBe(false)

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(resolved).toBe(true)
        })
    })

    describe('error handling', () => {
        test.skip('throws on empty command', async () => {
            await expect(run('')).rejects.toThrow('run: bad command')
        })

        test('handles process errors when not restarting', async () => {
            const promise = run('test-command')
            const mockProcess = spawn.mock.results[0].value

            expect(() => {
                mockProcess.emit('error', new Error('Process error'))
            }).toThrow()

            mockProcess.emit('exit', 1)

            await promise
        })
    })

    describe('restart functionality', () => {
        test('sets restart function in runState', async () => {
            const promise = run('echo test')

            expect(runState.restart).toBeDefined()
            expect(typeof runState.restart).toBe('function')

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise
        })

        test('removes restart function after exit', async () => {
            const promise = run('echo test')

            expect(runState.restart).toBeDefined()

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(runState.restart).toBeUndefined()
        })

        test.skip('restart kills current process', async () => {
            const promise = run('echo test')
            const mockProcess = spawn.mock.results[0].value

            expect(runState.restart).toBeDefined()

            // Call restart
            runState.restart!()

            // Wait for kill
            await new Promise(resolve => setTimeout(resolve, 50))

            expect(mockProcess.killed).toBe(true)

            // Complete restart cycle
            mockProcess.emit('exit', 0)
            await new Promise(resolve => setTimeout(resolve, 150))

            const newMockProcess = spawn.mock.results[1]?.value
            if (newMockProcess) {
                newMockProcess.emit('exit', 0)
            }
        }, 10000)

        test('restart function is removed after calling', async () => {
            const promise = run('echo test')
            const mockProcess = spawn.mock.results[0].value

            const restartFn = runState.restart

            restartFn!()

            expect(runState.restart).toBeUndefined()

            mockProcess.emit('exit', 0)
            await new Promise(resolve => setTimeout(resolve, 150))
        })
    })

    describe('command parsing', () => {
        test('handles mixed quotes', async () => {
            const promise = run('cmd "arg1" \'arg2\' arg3')

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(spawn).toHaveBeenCalledWith('cmd', ['arg1', 'arg2', 'arg3'], expect.any(Object))
        })

        test('handles empty quotes', async () => {
            const promise = run('cmd "" test')

            const mockProcess = spawn.mock.results[0].value
            mockProcess.emit('exit', 0)

            await promise

            expect(spawn).toHaveBeenCalledWith('cmd', ['', 'test'], expect.any(Object))
        })
    })
})
