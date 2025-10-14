export default {
    ignores: ['.dev', 'public', 'node_modules'],
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
        'value-keyword-case': null,
        'custom-property-pattern': null,
        'hue-degree-notation': null,
        'custom-property-empty-line-before': null,
        'scss/at-extend-no-missing-placeholder': null,
        'scss/at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'config',
                    'tailwind',
                    'apply',
                    'plugin',
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
