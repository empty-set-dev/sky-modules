#!/usr/bin/env -S pnpm exec tsx
import { multi_command } from './lib/command'

await multi_command('node', [
    {
        name: 'dev',
        description: 'Dev',
    },
    {
        name: 'start',
        description: 'Start',
    },
])
