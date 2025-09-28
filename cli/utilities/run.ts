import { execSync, spawn, SpawnOptionsWithoutStdio } from 'child_process'

export const runState: { restart?: () => void } = {}

export default async function run(
    command: string,
    parameters?: SpawnOptionsWithoutStdio
): Promise<void> {
    return new Promise(resolve => {
        let abortController: AbortController
        let isRestarting = false
        let lastStart = Date.now()

        async function start(): Promise<void> {
            lastStart = Date.now()

            const matches = command.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)
            const argv = matches ? matches.map(arg => arg.replace(/^"|"$|^'|'$/g, '')) : null

            if (argv == null) {
                throw new Error('run: bad command')
            }

            abortController = new AbortController()

            const childProcess = spawn(argv[0], argv.slice(1), {
                stdio: 'inherit',
                signal: abortController.signal,

                ...parameters,
            })

            childProcess.addListener('error', error => {
                if (!isRestarting) {
                    throw new Error('error', { cause: error })
                }
            })

            childProcess.addListener('exit', () => {
                delete runState.restart

                if (isRestarting) {
                    isRestarting = false
                    execSync('./cli/utilities/shutdown.sh')
                    void start()
                } else {
                    resolve()
                }
            })

            runState.restart = (): void => {
                const needTime = 3000 + lastStart - Date.now()

                if (needTime > 0) {
                    setTimeout(() => {
                        isRestarting = true
                        abortController && abortController.abort()
                    }, needTime)
                } else {
                    isRestarting = true
                    abortController && abortController.abort()
                }

                delete runState.restart
            }
        }

        void start()
    })
}
