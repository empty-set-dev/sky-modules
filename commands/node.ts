#!/usr/bin/env -S pnpm exec bun

import { Argv } from 'yargs'

export default function init(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <name>',
            'Dev (Bun)',
            () => null,
            async argv => (await import('./node-dev')).default(argv)
        )
        .command(
            'start <name>',
            'Start (Bun)',
            () => null,
            async argv => (await import('./node-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
