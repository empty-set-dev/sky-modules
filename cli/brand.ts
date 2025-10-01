import { Argv } from 'yargs'

export default function brand(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'init <app-name>',
            'Initialize brand system for app',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('template', {
                        describe: 'Brand template to use',
                        type: 'string',
                        choices: ['reset', 'sky', 'custom'] as const,
                        default: 'reset' as const,
                    }),
            async argv => (await import('./brand-init')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build brand CSS variables',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('input', {
                        describe: 'Brand configuration file path',
                        type: 'string',
                        default: 'Auto-detect *.brand.ts in app path',
                    })
                    .option('output', {
                        describe: 'Output CSS file path',
                        type: 'string',
                        default: 'Auto-generate based on input file',
                    })
                    .option('minify', {
                        describe: 'Minify CSS output',
                        type: 'boolean',
                        default: false,
                    })
                    .option('watch', {
                        describe: 'Watch for changes and rebuild',
                        type: 'boolean',
                        default: false,
                    }),
            async argv => (await import('./brand-build')).default(argv)
        )
        .command(
            'validate <app-name>',
            'Validate brand configuration',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('input', {
                        describe: 'Brand configuration file path',
                        type: 'string',
                    })
                    .option('strict', {
                        describe: 'Enable strict validation',
                        type: 'boolean',
                        default: false,
                    }),
            async argv => (await import('./brand-validate')).default(argv)
        )
        .command(
            'info <app-name>',
            'Show brand system information',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('input', {
                        describe: 'Brand configuration file path',
                        type: 'string',
                    })
                    .option('stats', {
                        describe: 'Show detailed statistics',
                        type: 'boolean',
                        default: false,
                    }),
            async argv => (await import('./brand-info')).default(argv)
        )
}
