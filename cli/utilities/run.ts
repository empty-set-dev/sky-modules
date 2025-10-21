import { exec, spawn, SpawnOptionsWithoutStdio } from 'child_process'

import { CLI_CONSTANTS, ExitCode } from '../constants'

export const runState: { restart?: () => void } = {}

function killProcessTree(pid: number): Promise<void> {
    return new Promise(resolve => {
        if (process.platform === 'win32') {
            // First try graceful shutdown on Windows
            exec(`taskkill /pid ${pid} /T`, () => {
                // Wait a bit, then force kill if still alive
                setTimeout(() => {
                    exec(`taskkill /pid ${pid} /T /F`, () => resolve())
                }, 1000)
            })
        } else {
            // For Unix/Linux/macOS: kill entire process group
            // First try SIGTERM for graceful shutdown
            exec(`kill -TERM -${pid}`, error => {
                if (error) {
                    // If graceful kill fails, force kill
                    exec(`kill -KILL -${pid}`, () => resolve())
                } else {
                    // Wait a bit, then force kill if still alive
                    setTimeout(() => {
                        exec(`kill -KILL -${pid}`, () => resolve())
                    }, 1000)
                }
            })
        }
    })
}

export default async function run(
    command: string,
    parameters?: SpawnOptionsWithoutStdio
): Promise<void> {
    return new Promise(resolve => {
        let isRestarting = false
        let lastStart = Date.now()
        let childProcess: ReturnType<typeof spawn> | null = null

        async function start(): Promise<void> {
            lastStart = Date.now()

            const matches = command.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)
            const argv = matches ? matches.map(arg => arg.replace(/^"|"$|^'|'$/g, '')) : null

            if (argv == null) {
                throw new Error('run: bad command')
            }

            childProcess = spawn(argv[0], argv.slice(1), {
                stdio: 'inherit',
                detached: true,
                ...parameters,
            })

            childProcess.addListener('error', error => {
                if (!isRestarting) {
                    throw new Error('error', { cause: error })
                }
            })

            childProcess.addListener('exit', () => {
                delete runState.restart
                removeSignalHandlers()

                if (isRestarting) {
                    isRestarting = false
                    // Wait for port to be released before restarting
                    setTimeout(() => {
                        void start()
                    }, CLI_CONSTANTS.PORT_RELEASE_DELAY_MS)
                } else {
                    resolve()
                }
            })

            runState.restart = (): void => {
                const needTime = CLI_CONSTANTS.RESTART_MIN_DELAY_MS + lastStart - Date.now()

                const doRestart = async (): Promise<void> => {
                    isRestarting = true
                    // Kill the entire process tree
                    if (childProcess && childProcess.pid && !childProcess.killed) {
                        await killProcessTree(childProcess.pid)
                    }
                }

                if (needTime > 0) {
                    setTimeout(() => void doRestart(), needTime)
                } else {
                    void doRestart()
                }

                delete runState.restart
            }
        }

        // Signal handlers for graceful shutdown
        const handleSignal = (signal: NodeJS.Signals): void => {
            if (childProcess && !childProcess.killed) {
                childProcess.kill(signal)
            }

            removeSignalHandlers()
            process.exit(ExitCode.SUCCESS)
        }

        const sigintHandler = (): void => handleSignal('SIGINT')
        const sigtermHandler = (): void => handleSignal('SIGTERM')

        const removeSignalHandlers = (): void => {
            process.off('SIGINT', sigintHandler)
            process.off('SIGTERM', sigtermHandler)
        }

        process.on('SIGINT', sigintHandler)
        process.on('SIGTERM', sigtermHandler)

        void start()
    })
}
