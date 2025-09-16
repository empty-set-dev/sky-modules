import js from '@eslint/js'
import eslintTypescriptPlugin from '@typescript-eslint/eslint-plugin'
import eslintTypescriptParser from '@typescript-eslint/parser'
import { ESLint } from 'eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintPrettierConfig from 'eslint-config-prettier'
import eslintImportPlugin from 'eslint-plugin-import'
import eslintPrettierPlugin from 'eslint-plugin-prettier'
import eslintReactPlugin from 'eslint-plugin-react'
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'
// import eslintNoMisusedDisposablePlugin from 'sky/commands/plugins/eslint-no-misused-disposable'

export default defineConfig([
    globalIgnores(['**/node_modules/**', '**/.dev/**', '!.dev/defines/**']),
    js.configs.recommended,
    eslintReactPlugin.configs.flat.recommended,
    eslintPrettierConfig,
    {
        files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],

        plugins: {
            react: eslintReactPlugin,
            'react-hooks': eslintReactHooksPlugin,
            prettier: eslintPrettierPlugin,
            import: eslintImportPlugin,
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.builtin,
                ...globals.commonjs,
                ...globals.es2022,
                ...globals.node,
            },

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },

        rules: {
            'react-hooks/rules-of-hooks': 'warn',
            'react-hooks/exhaustive-deps': 'off',
            'react/no-unknown-property': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/display-name': 'off',
            'react/prop-types': 'off',
            'react/jsx-no-undef': 'off',
            'prettier/prettier': 'warn',
            'no-undef': 'off',
            'no-console': 'warn',
            'no-debugger': 'warn',
            'no-unused-vars': 'off',
            'no-var': 'off',
            semi: 'off',
            'keyword-spacing': ['warn', { before: true }],
            'import/no-empty-named-blocks': 'off',
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: '*.css',
                            group: 'index',
                            patternOptions: { matchBase: true },
                            position: 'after',
                        },
                        {
                            pattern: '*.scss',
                            group: 'index',
                            patternOptions: { matchBase: true },
                            position: 'after',
                        },
                        {
                            pattern: '#/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            react: eslintReactPlugin,
            'react-hooks': eslintReactHooksPlugin,
            '@typescript-eslint': eslintTypescriptPlugin as typeof eslintTypescriptPlugin &
                ESLint.Plugin,
            // 'no-misused-disposable-plugin':
            //     eslintNoMisusedDisposablePlugin as typeof eslintNoMisusedDisposablePlugin &
            //         ESLint.Plugin,
            prettier: eslintPrettierPlugin,
            import: eslintImportPlugin,
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        languageOptions: {
            parser: eslintTypescriptParser,

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 2020,
                sourceType: 'module',
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },

            globals: {
                ...globals.browser,
                ...globals.builtin,
                ...globals.commonjs,
                ...globals.es2022,
                ...globals.node,
            },
        },

        rules: {
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            // 'no-misused-disposable-plugin/no-misused-disposable': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/camelcase': 'off',
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'warn',
            '@typescript-eslint/no-empty-function': 'warn',
            'react-hooks/rules-of-hooks': 'warn',
            'react-hooks/exhaustive-deps': 'off',
            'react/no-unknown-property': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/display-name': 'off',
            'react/prop-types': 'off',
            'react/jsx-no-undef': 'off',
            'prettier/prettier': 'warn',
            'no-undef': 'off',
            'no-console': 'warn',
            'no-debugger': 'warn',
            'no-unused-vars': 'off',
            'no-var': 'off',
            semi: 'off',
            'keyword-spacing': ['warn', { before: true }],
            'import/no-empty-named-blocks': 'off',
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': 'off',
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: '*.css',
                            group: 'index',
                            patternOptions: { matchBase: true },
                            position: 'after',
                        },
                        {
                            pattern: '*.scss',
                            group: 'index',
                            patternOptions: { matchBase: true },
                            position: 'after',
                        },
                        {
                            pattern: '#/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
])
