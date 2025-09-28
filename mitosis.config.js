/**
 * @type {import('@builder.io/mitosis').MitosisConfig}
 */
module.exports = {
    files: 'universal/**/*.lite.tsx',
    targets: [
        'alpine',
        'angular',
        'customElement',
        'html',
        'liquid',
        'react',
        'reactNative',
        'solid',
        'svelte',
        'swift',
        'template',
        'vue',
        'stencil',
        'qwik',
        'marko',
        'preact',
        'lit',
        'rsc',
        'taro',
    ],
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
        reactNative: {
            typescript: true,
        },
        preact: {
            typescript: true,
        },
        rsc: {
            typescript: true,
        },
        stencil: {
            typescript: true,
        },
        lit: {
            typescript: true,
        },
        taro: {
            typescript: true,
        },
    },
}
