export default {
    ignores: ['.dev', 'public', 'node_modules', 'x'],
    extends: [
        'stylelint-config-standard',
        'stylelint-config-recommended-scss',
        'stylelint-config-prettier-scss',
    ],
    plugins: ['stylelint-scss', 'stylelint-order'],
    rules: {
        'import-notation': 'string',
        'selector-class-pattern': '.*',
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['root', 'global'],
            },
        ],
        'color-function-notation': null,
        'color-function-alias-notation': null,
        'alpha-value-notation': null,
        'color-hex-length': null,
        'value-keyword-case': null,
        'custom-property-pattern': null,
        'hue-degree-notation': null,
        'custom-property-empty-line-before': null,
        'declaration-block-single-line-max-declarations': null,
        'scss/at-extend-no-missing-placeholder': null,
        'scss/at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'config',
                    'tailwind',
                    'apply',
                    'plugin',
                    'utility',
                    'variants',
                    'responsive',
                    'screen',
                    'theme',
                    'source',
                    'reference',
                ],
            },
        ],
    },
}
