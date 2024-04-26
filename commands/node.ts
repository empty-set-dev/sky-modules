#!/usr/bin/env tsx
import __import from './__import'
import args from 'args'

function initArgs() {
    args.command('dev', 'Dev', () => {})
    args.command('build', 'Build', () => {})
    args.command('start', 'Start', () => {})
    
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
} else if (!__import(`./node-${command}.ts`)) {
    initArgs()
    // eslint-disable-next-line no-console
    console.error(`node: command "${command}" not found`)
    args.showHelp()
}
