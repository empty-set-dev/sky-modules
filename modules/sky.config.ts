import '@sky-modules/cli/configuration'

export default {
    id: 'sky.modules',
    package: '@sky-modules/modules',
    publishable: true,
    npm: {
        description: 'Application modules - user authentication, hexagon grid, and game utilities',
        keywords: ['modules', 'user', 'auth', 'hexagon', 'grid', 'game'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
    },
} satisfies Sky.ModuleConfig
