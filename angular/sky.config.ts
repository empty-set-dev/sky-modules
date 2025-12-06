import '@sky-modules/cli/configuration'

export default {
    id: 'sky.angular',
    package: '@sky-modules/angular',
    publishable: true,
    npm: {
        description: 'Angular integration components and utilities',
        keywords: ['angular', 'components', 'utilities'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core', '@sky-modules/platform'],
        peerDependencies: {
            '@angular/core': '>=20.0.0',
            '@angular/common': '>=20.0.0',
        },
    },
} satisfies Sky.ModuleConfig
