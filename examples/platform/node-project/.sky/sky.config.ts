import { SkyConfigDescription } from 'sky/configuration/SkyConfig'

export default {
    name: 'Node Project',
    id: 'node-project',
    modules: {
        sky: {
            id: 'sky',
            path: '.dev/node_modules/sky',
        },
    },
    examples: {},
    apps: {
        app: {
            id: 'app',
            target: 'node',
        }
    },
    scripts: {},
    folders: { '.': 'Node Project' },
} as SkyConfigDescription
