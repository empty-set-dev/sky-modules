import { Argv } from 'yargs'

export default function generate(yargs: Argv): Argv {
    return yargs
        .command(
            'index <path>',
            'Generate index.ts file',
            yargs =>
                yargs
                    .positional('path', {
                        describe: 'Path to module or slice',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('recursive', {
                        alias: 'r',
                        describe: 'Recursively generate index.ts in all subdirectories',
                        type: 'boolean',
                        default: false,
                    }),
            async argv => (await import('./generate--index')).default(argv)
        )
        .command(
            'global <path>',
            'Generate global.ts file',
            yargs =>
                yargs
                    .positional('path', {
                        describe: 'Path to module or slice',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('recursive', {
                        alias: 'r',
                        describe: 'Recursively generate global.ts in all subdirectories',
                        type: 'boolean',
                        default: false,
                    }),
            async argv => (await import('./generate--global')).default(argv)
        )
        .command(
            'global-files <path>',
            'Generate .global.ts files for all modules',
            yargs =>
                yargs.positional('path', {
                    describe: 'Path to scan for modules',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => (await import('./generate--global-files')).default(argv)
        )
        .command(
            'meta <path>',
            'Generate index.ts, global.ts, and .global.ts files (all-in-one)',
            yargs =>
                yargs.positional('path', {
                    describe: 'Path to scan for modules',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => (await import('./generate--meta')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
        .demandCommand()
        .help()
}
