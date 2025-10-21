import { exec, spawn, SpawnOptionsWithoutStdio } from 'child_process'

import { CLI_CONSTANTS, ExitCode } from '../constants'

export const runState: { restart?: () => void } = {}

function killProcessAndChildren(pid: number): Promise<void> {
    return new Promise(resolve => {
        if (process.platform === 'win32') {
            // Windows: kill process tree
            exec(`taskkill /pid ${pid} /T /F`, () => resolve())
        } else {
            // Unix: find and kill all child processes
            exec(`pkill -P ${pid}; kill ${pid}`, () => {
                // Wait a bit and force kill if still alive
                setTimeout(() => {
                    exec(`pkill -9 -P ${pid}; kill -9 ${pid}`, () => resolve())
                }, 1000)
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

                const doRestart = (): void => {
                    isRestarting = true
                    // Kill the child process (it will kill its children on SIGTERM)
                    if (childProcess && !childProcess.killed) {
                        childProcess.kill('SIGTERM')
                    }
                }

                if (needTime > 0) {
                    setTimeout(() => doRestart(), needTime)
                } else {
                    doRestart()
                }

                delete runState.restart
            }
        }

        // Signal handlers for graceful shutdown
        const handleSignal = async (_: NodeJS.Signals): Promise<void> => {
            if (childProcess && childProcess.pid && !childProcess.killed) {
                await killProcessAndChildren(childProcess.pid)
            }

            removeSignalHandlers()
            process.exit(ExitCode.SUCCESS)
        }

        const sigintHandler = (): void => void handleSignal('SIGINT')
        const sigtermHandler = (): void => void handleSignal('SIGTERM')

        const removeSignalHandlers = (): void => {
            process.off('SIGINT', sigintHandler)
            process.off('SIGTERM', sigtermHandler)
        }

        process.on('SIGINT', sigintHandler)
        process.on('SIGTERM', sigtermHandler)

        void start()
    })
}
