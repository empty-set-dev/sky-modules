#!/usr/bin/env -S pnpm exec bun
import { multi_command } from './lib/command'

await multi_command('web', [
    {
        name: 'init',
        description: 'Init',
    },
    {
        name: 'dev',
        description: 'Dev',
    },
    {
        name: 'build',
        description: 'Build',
    },
    {
        name: 'start',
        description: 'Start',
    },
])
