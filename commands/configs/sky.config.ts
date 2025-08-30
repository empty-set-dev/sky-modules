import { SkyConfigDescription } from 'sky/configuration/SkyConfig'

export default {
    name: '${PROJECT_TITLE}',
    id: '${PROJECT_NAME}',
    modules: {
        sky: {
            id: 'sky',
            path: 'node_modules/sky',
        },
    },
    examples: {},
    apps: {},
    scripts: {},
    folders: { '.': '${PROJECT_TITLE}' },
} as SkyConfigDescription
