import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Dynamic configuration helpers
function getPackageInfo() {
    const packagePath = join(fileURLToPath(new URL('../../', import.meta.url)), 'package.json')
    if (existsSync(packagePath)) {
        const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
        return {
            name: packageJson.name || 'project',
            description: packageJson.description || 'Project documentation'
        }
    }
    return { name: 'project', description: 'Project documentation' }
}

const packageInfo = getPackageInfo()

export default defineConfig({
    title: `${packageInfo.name} Modules`,
    description: packageInfo.description,
    base: `/${packageInfo.name}-modules/`,

    // Multi-language configuration
    locales: {
        root: {
            label: 'English',
            lang: 'en',
            title: `${packageInfo.name} Modules`,
            description: packageInfo.description
        },
        ru: {
            label: 'Русский',
            lang: 'ru',
            title: `${packageInfo.name} Modules`,
            description: 'Мощные TypeScript утилиты для современной разработки',
            themeConfig: {
                nav: [
                    { text: 'Руководство', link: '/ru/guide/getting-started' },
                    { text: 'Модули', link: '/ru/modules/' },
                    { text: 'Примеры', link: '/ru/examples/' },
                    { text: 'Песочница', link: '/ru/playground/' },
                    {
                        text: 'NPM',
                        items: [
                            { text: `@${packageInfo.name}-modules/core`, link: `https://npmjs.com/package/@${packageInfo.name}-modules/core` },
                            { text: 'Все пакеты', link: '/ru/packages/' }
                        ]
                    }
                ],
                sidebar: {
            '/modules/core/': [
                            {
                                'text': 'core Modules',
                                'items': [
                                    {
                                        'text': 'Array',
                                        'link': '/modules/core/Array'
                                    },
                                    {
                                        'text': 'mergeNamespace',
                                        'link': '/modules/core/mergeNamespace'
                                    }
                                ]
                            }
            ],
            '/modules/': [
                            {
                                'text': 'core Modules',
                                'items': [
                                    {
                                        'text': 'Array',
                                        'link': '/modules/core/Array'
                                    },
                                    {
                                        'text': 'mergeNamespace',
                                        'link': '/modules/core/mergeNamespace'
                                    }
                                ]
                            }
            ]
                },

        socialLinks: [
            { icon: 'github', link: `https://github.com/empty-set-dev/${packageInfo.name}-modules` },
            { icon: 'npm', link: `https://npmjs.com/~${packageInfo.name}-modules` }
        ],

        footer: {
            message: 'Released under the ISC License.',
            copyright: 'Copyright © 2025 Anya Sky'
        },

        search: {
            provider: 'local'
        },

        editLink: {
            pattern: `https://github.com/empty-set-dev/${packageInfo.name}-modules/edit/main/docs/:path`
        }
    },

    vite: {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('../../', import.meta.url)),
                [packageInfo.name]: fileURLToPath(new URL('../../', import.meta.url))
            }
        }
    },

    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        },
        lineNumbers: true
    }
})