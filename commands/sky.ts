#!/usr/bin/env tsx
import __import from './__import'
import args from 'args'

function initArgs() {
    args.command('init', 'Init', () => __import(`init.ts`))
    args.command('readme', 'Readme', () => __import(`readme.ts`))
    args.command('browser', 'Browser', () => __import(`browser.ts`))
    args.command('node', 'Node', () => __import(`node.ts`))
    
    args.parse(process.argv, {
        name: 'sky',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[2]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./${command}.ts`)) {
    initArgs()
    // eslint-disable-next-line no-console
    console.error(`command "${command}" not found`)
    args.showHelp()
}