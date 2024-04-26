#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __import from './__import'

function initArgs(): void {
    args.command('build', 'Build docs', () => {})

    args.parse(process.argv, {
        name: 'sky readme',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./readme-${command}.ts`)) {
    initArgs()
    // eslint-disable-next-line no-console
    console.error(`readme: command "${command}" not found`)
    args.showHelp()
}
