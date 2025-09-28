import { SkyConfigDescription } from '@sky-modules/configuration/Sky.Config.global'

export default {
    name: '{{PROJECT_TITLE}}',
    id: '{{PROJECT_NAME}}',
    modules: {
        sky: {
            id: 'sky',
            path: 'node_modules/sky',
        },
    },
    examples: {},
    apps: {},
    scripts: {},
    folders: { '.': '{{PROJECT_TITLE}}' },
} as SkyConfigDescription
