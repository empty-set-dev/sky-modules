/**
 * @type {import('@builder.io/mitosis').MitosisConfig}
 */
export default {
    files: 'universal/**/*.lite.*',
    targets: ['react'],
    dest: 'examples/universal/mitosis',
    fileExtension: 'tsx',
    extensions: ['.lite.ts', '.lite.tsx'],
    commonOptions: {
        typescript: true,
        explicitImportFileExtension: false,
    },
}
