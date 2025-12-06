import '@sky-modules/cli/configuration'

export default {
    id: 'sky.serverless',
    package: '@sky-modules/serverless',
    publishable: true,
    npm: {
        description: 'Serverless utilities and handlers - Hono, Vike, and worker integrations',
        keywords: ['serverless', 'hono', 'vike', 'worker', 'cloudflare'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
        peerDependencies: {
            hono: '>=4.0.0',
            vike: '>=0.4.0',
        },
    },
} satisfies Sky.ModuleConfig
