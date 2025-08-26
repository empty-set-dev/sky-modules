import { multi_command } from './lib/command'

await multi_command('ios', [
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
