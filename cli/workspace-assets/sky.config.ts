import { SkyConfigDescription } from '@sky-modules/cli/configuration/global/Sky.Config'

export default {
    name: '{{PROJECT_TITLE}}',
    id: '{{PROJECT_NAME}}',
    modules: {
        sky: {
            id: 'sky',
            path: 'node_modules/sky',
        },
    },
    playground: {},
    apps: {},
    scripts: {},
    folders: { '.': '{{PROJECT_TITLE}}' },
} as SkyConfigDescription
