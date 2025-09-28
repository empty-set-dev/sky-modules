/**
 * @type {import('@builder.io/mitosis').MitosisConfig}
 */
module.exports = {
  files: 'universal/**/*.lite.tsx',
  targets: ['react', 'vue', 'svelte', 'solid', 'angular', 'qwik'],
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