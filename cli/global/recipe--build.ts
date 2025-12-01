export default {
    command: 'recipe build <appName>',
    describe: 'Build CSS from recipe.lite.ts files',
    builder: {
        input: {
            type: 'string',
            description: 'Input directory to search for recipe files (defaults to app path)',
        },
        output: {
            type: 'string',
            description: 'Output directory for CSS files (defaults to same location as recipe files)',
        },
        watch: {
            type: 'boolean',
            default: false,
            description: 'Watch for changes and rebuild',
        },
    },
} as const
