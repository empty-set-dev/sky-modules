import '@sky-modules/cli/configuration'

export default {
    id: 'sky.crypto',
    package: '@sky-modules/crypto',
    publishable: true,
    npm: {
        description: 'Cryptography utilities and helpers',
        keywords: ['crypto', 'encryption', 'hashing', 'security'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
    },
} satisfies Sky.ModuleConfig
