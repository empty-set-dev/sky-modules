import webpack, { ProgressPlugin } from 'webpack'

export default function __getProgressPlugin(): ProgressPlugin {
    return new webpack.ProgressPlugin({
        activeModules: false,
        entries: true,
        handler(percentage, message): void {
            const b = '\x1b['
            const e = '\x1b[0m'
            // eslint-disable-next-line no-console
            console.clear()
            // eslint-disable-next-line no-console
            console.log(`${b}${'35;1m'}${(percentage * 100).toFixed(1)}%${e}`, message)
        },
        modules: true,
        modulesCount: 5000,
        profile: false,
        dependencies: true,
        dependenciesCount: 10000,
        percentBy: null,
    })
}
