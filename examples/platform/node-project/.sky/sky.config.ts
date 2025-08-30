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
    apps: {},
    scripts: {},
    folders: { '.': 'Node Project' },
} as SkyConfigDescription
