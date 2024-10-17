#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import { fileURLToPath } from 'url'

import args from 'args'
import dotenv from 'dotenv'
import { errorConsole } from 'sky/helpers/console'

import __import from './__import'

process.mainModule = {
    filename: fileURLToPath(import.meta.url),
} as never

function initArgs(): void {
    args.command('init', 'Init', () => {})
    args.command('readme', 'Readme', () => {})
    args.command('test', 'Test (Jest)', () => {})
    args.command('run', 'Run (Tsx)', () => {})
    args.command('web', 'Web', () => {})
    args.command('node', 'Node', () => {})
    args.command('desktop', 'Desktop (Tauri)', () => {})
    args.command('ios', 'ios (Expo)', () => {})
    args.command('android', 'ios (Expo)', () => {})
    args.command('format', 'Format', () => {})

    args.parse(process.argv, {
        name: 'sky',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[2]
const subCommand = process.argv[3]

let mode = 'development'
if (command === 'test') {
    mode = 'test'
}

if (command === 'web' && subCommand === 'dev') {
    mode = 'development'
}

if (command === 'web' && subCommand === 'build') {
    mode = 'production'
}

if (command === 'web' && subCommand === 'preview') {
    mode = 'production'
}

if (command === 'web' && subCommand === 'start') {
    mode = 'production'
}

if (command === 'node' && subCommand === 'dev') {
    mode = 'development'
}

if (command === 'node' && subCommand === 'start') {
    mode = 'production'
}

if (command === 'desktop' && subCommand === 'dev') {
    mode = 'development'
}

if (command === 'desktop' && subCommand === 'build') {
    mode = 'production'
}

if (command === 'desktop' && subCommand === 'start') {
    mode = 'production'
}

dotenv.config({
    path: [`.env.${mode}.local`, '.env.local', `.env.${mode}`, '.env'],
})

if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./${command}.ts`)) {
    initArgs()
    errorConsole(`command "${command}" not found`)
    args.showHelp()
}
