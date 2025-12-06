import '@sky-modules/cli/configuration'

export default {
    id: 'sky.design',
    package: '@sky-modules/design',
    publishable: true,
    npm: {
        description:
            'Design system components and utilities - UI components, layout helpers, and styling utilities',
        keywords: ['design', 'ui', 'components', 'layout', 'styling', 'sx', 'css'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
        peerDependencies: {
            '@pandacss/dev': '>=1.0.0',
        },
    },
} satisfies Sky.ModuleConfig
