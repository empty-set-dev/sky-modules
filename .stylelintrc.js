// TODO

export default {
    extends: ['stylelint-config-standard-scss'],
    plugins: ['stylelint-prettier', 'stylelint-scss', 'stylelint-order'],
    rules: {
        'prettier/prettier': true,
        'selector-class-pattern': '.*',
    },
}
