import '@sky-modules/cli/configuration'

export default {
    id: 'sky.database',
    package: '@sky-modules/database',
    publishable: true,
    npm: {
        description: 'Database utilities and ORM helpers',
        keywords: ['database', 'orm', 'sql', 'knex'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
    },
} satisfies Sky.ModuleConfig
