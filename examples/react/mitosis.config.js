/**
 * @type {import('@builder.io/mitosis').MitosisConfig}
 */
export default {
    files: 'universal/**/*.uc.tsx',
    targets: ['./react'],
    dest: 'mitosis',
    options: {
        react: {
            typescript: true,
            stylesType: 'twrnc',
        },
    },
}
