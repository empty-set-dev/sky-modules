import '@sky-modules/cli/configuration'

export default {
    id: 'sky.vike',
    package: '@sky-modules/vike',
    publishable: true,
    npm: {
        description: 'Vike integration utilities and components',
        keywords: ['vike', 'ssr', 'react', 'server-side-rendering'],
        access: 'public',
        modules: ['.'],
        separateModules: ['async-data', 'config'],
        dependencies: ['@sky-modules/core'],
        peerDependencies: {
            vike: '>=0.4.0',
        },
    },
} satisfies Sky.ModuleConfig
