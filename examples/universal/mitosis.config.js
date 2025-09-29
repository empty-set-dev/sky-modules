/**
 * @type {import('@builder.io/mitosis').MitosisConfig}
 */
export default {
    files: 'universal/**/*.lite.tsx',
    targets: ['react'],
    dest: 'examples/universal/mitosis',
    extensions: ['.uc.tsx', '.lite.tsx'],
    options: {
        react: {
            typescript: true,
        },
    },
}
