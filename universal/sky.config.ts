import '@sky-modules/cli/configuration'

export default {
    id: 'sky.universal',
    package: '@sky-modules/universal',
    publishable: true,
    npm: {
        description: 'Universal cross-framework components and utilities',
        keywords: ['universal', 'cross-framework', 'mitosis', 'components'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
    },
} satisfies Sky.ModuleConfig
