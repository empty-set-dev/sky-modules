import '@sky-modules/cli/configuration'

export default {
    id: 'sky.ecs',
    package: '@sky-modules/ecs',
    publishable: true,
    npm: {
        description: 'Entity Component System - physics and game development utilities',
        keywords: ['ecs', 'entity', 'component', 'system', 'physics', 'game'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core', '@sky-modules/math'],
    },
} satisfies Sky.ModuleConfig
