#!/usr/bin/env -S pnpm exec bun
import { multi_command } from './lib/command'

await multi_command('universal', [
    {
        name: 'init',
        description: 'Init',
    },
])
