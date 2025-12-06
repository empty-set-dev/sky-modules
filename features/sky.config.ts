import '@sky-modules/cli/configuration'

export default {
    id: 'sky.features',
    package: '@sky-modules/features',
    publishable: true,
    npm: {
        description: 'Feature flags and management utilities for modern applications',
        keywords: ['features', 'flags', 'toggle', 'configuration', 'management', 'utilities'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
    },
} satisfies Sky.ModuleConfig
