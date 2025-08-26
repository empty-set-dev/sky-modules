#!/usr/bin/env -S pnpm exec tsx
import { multi_command } from './lib/command'

await multi_command('universal', [
    {
        name: 'init',
        description: 'Init',
    },
])
