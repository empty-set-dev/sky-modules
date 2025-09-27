import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    title: 'Sky Modules',
    description: 'Powerful TypeScript utility modules for modern development',
    base: '/sky-modules/',

    head: [
        ['link', { rel: 'icon', href: '/sky-modules/favicon.svg' }],
        ['meta', { name: 'theme-color', content: '#22c55e' }],
    ],

    themeConfig: {
        logo: '/logo.svg',
        siteTitle: 'Sky Modules',

        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'Modules', link: '/modules/' },
            { text: 'Examples', link: '/examples/' },
            { text: 'Playground', link: '/playground/' },
            {
                text: 'NPM',
                items: [
                    { text: '@sky-modules/core', link: 'https://npmjs.com/package/@sky-modules/core' },
                    { text: 'All Packages', link: '/packages/' }
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
            { icon: 'github', link: 'https://github.com/empty-set-dev/sky-modules' },
            { icon: 'npm', link: 'https://npmjs.com/~sky-modules' }
        ],

        footer: {
            message: 'Released under the ISC License.',
            copyright: 'Copyright © 2025 Anya Sky'
        },

        search: {
            provider: 'local'
        },

        editLink: {
            pattern: 'https://github.com/empty-set-dev/sky-modules/edit/main/docs/:path'
        }
    },

    vite: {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('../../', import.meta.url)),
                'sky': fileURLToPath(new URL('../../', import.meta.url))
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