import '@sky-modules/cli/configuration'

export default {
    id: 'sky.effects',
    package: '@sky-modules/effects',
    publishable: true,
    npm: {
        description:
            'Side effects and controllers - input handling, visibility, and state management',
        keywords: ['effects', 'controllers', 'input', 'mixins', 'utilities'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
    },
} satisfies Sky.ModuleConfig
