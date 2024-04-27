import webpack, { ProgressPlugin } from 'webpack'

export default function __getProgressPlugin(): ProgressPlugin {
    return new webpack.ProgressPlugin({
        activeModules: false,
        entries: true,
        handler(percentage, message): void {
            const b = '\x1b['
            const e = '\x1b[0m'
            const totalLines = 78

            const lines = Math.floor(percentage * totalLines)
            let loader = '['

            for (let i = 0; i < lines; ++i) {
                loader += '='
            }

            for (let i = 0; i < 78 - lines; ++i) {
                loader += ' '
            }

            loader += ']'

            process.stdout.clearLine(0)
            process.stdout.cursorTo(0)
            // eslint-disable-next-line no-console
            process.stdout.write(`${b}${'35;1m'}${loader}${e} ${message}`)

            if (percentage >= 1) {
                process.stdout.write('\n')
            }
        },
        modules: true,
        modulesCount: 5000,
        profile: false,
        dependencies: true,
        dependenciesCount: 10000,
        percentBy: null,
    })
}
