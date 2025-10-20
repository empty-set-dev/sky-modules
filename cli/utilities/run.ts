import { exec, spawn, SpawnOptionsWithoutStdio } from 'child_process'

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
            // For Unix/Linux/macOS: find all child processes and kill them
            exec(`ps -o pid --no-headers --ppid ${pid}`, (error, stdout) => {
                const childPids = stdout
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .map(pid => parseInt(pid, 10))

                // Kill all child processes
                childPids.forEach(childPid => {
                    try {
                        process.kill(childPid, 'SIGTERM')
                    } catch {
                        // Process already dead
                    }
                })

                // Kill the main process
                try {
                    process.kill(pid, 'SIGTERM')
                } catch {
                    // Process already dead
                }

                resolve()
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
                detached: false,
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
                    }, 1500)
                } else {
                    resolve()
                }
            })

            runState.restart = (): void => {
                const needTime = 3000 + lastStart - Date.now()

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
            process.exit(0)
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
