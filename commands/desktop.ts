import { multi_command } from './lib/command'

await multi_command('desktop', [
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
])
