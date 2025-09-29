/**
 * @type {import('@builder.io/mitosis').MitosisConfig}
 */
export default {
    files: 'universal/**/*.lite.tsx',
    targets: ['react', 'vue', 'solid', 'svelte', 'angular', 'qwik'],
    dest: 'generated-components',
    options: {
        react: {
            typescript: true,
            stylesType: 'styled-components',
        },
        vue: {
            typescript: true,
        },
        svelte: {
            typescript: true,
        },
        solid: {
            typescript: true,
        },
        angular: {
            typescript: true,
        },
        qwik: {
            typescript: true,
        },
    },
}
