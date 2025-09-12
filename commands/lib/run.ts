import { execSync, spawn, SpawnOptionsWithoutStdio } from 'child_process'

export const runState: { restart?: () => void } = {}

export default async function run(
    command: string,
    parameters?: SpawnOptionsWithoutStdio
): Promise<void> {
    return new Promise(resolve => {
        let abortController: AbortController
        let isRestarting = false

        async function start(): Promise<void> {
            const matches = command.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)
            const argv = matches ? matches.map(arg => arg.replace(/^"|"$|^'|'$/g, '')) : null

            if (argv == null) {
                throw Error('run: bad command')
            }

            abortController = new AbortController()

            const childProcess = spawn(argv[0], argv.slice(1), {
                stdio: 'inherit',
                signal: abortController.signal,

                ...parameters,
            })

            childProcess.addListener('error', error => {
                if (!isRestarting) {
                    throw Error('error', { cause: error })
                }
            })

            childProcess.addListener('exit', () => {
                if (isRestarting) {
                    isRestarting = false
                    execSync('./commands/lib/shutdown.sh')
                    void start()
                }
            })

            childProcess.addListener('close', () => {
                delete runState.restart
                resolve()
            })

            runState.restart = (): void => {
                isRestarting = true
                abortController && abortController.abort()
            }
        }

        void start()
    })
}
