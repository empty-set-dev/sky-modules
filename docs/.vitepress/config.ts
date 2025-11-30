import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Dynamic configuration helpers
function getPackageInfo() {
    const packagePath = resolve(__dirname, '../../package.json')
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

// Generate sidebar items for core modules dynamically
const coreSidebarItems = (() => {
    try {
        const coreModules = readdirSync(resolve(__dirname, '../../core'))
            .filter(name => {
                // Filter out files and system files
                if (name.match(/\.(ts|json|md)$/)) return false
                if (name.startsWith('.')) return false
                return true
            })
            .sort()

        return coreModules.map(name => ({
            text: name,
            link: `/modules/core/${name}`
        }))
    } catch (e) {
        console.error('Failed to generate core sidebar:', e)
        return []
    }
})()

export default defineConfig({
    title: `${packageInfo.name} Modules`,
    description: packageInfo.description,
    base: process.env.NODE_ENV === 'production' ? `/${packageInfo.name}-modules/` : '/',

    // Exclude playground and examples from being scanned
    srcExclude: [
        '**/playground/**',
        '**/canvas/examples/**',
        '**/cli/boilerplates/**',
        '**/.dev/**'
    ],

    // Rewrites to read documentation from source code directories
    rewrites: {
        // Core modules - English
        '../core/:module/README.md': 'modules/core/:module.md',
        // Core modules - Russian
        '../core/:module/README.ru.md': 'ru/modules/core/:module.md',
        // Canvas - English
        '../canvas/README.md': 'modules/Canvas/Canvas.md',
        // Canvas - Russian
        '../canvas/README.ru.md': 'ru/modules/Canvas/Canvas.md',
        // Platform - English
        '../platform/Platform.md': 'modules/platform/platform.md',
        // Platform - Russian
        '../platform/Platform.ru.md': 'ru/modules/platform/platform.md',
    },

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
                      'nav': [
                                {
                                          'text': 'Модули',
                                          'link': '/ru/modules/'
                                },
                                {
                                          'text': 'NPM',
                                          'items': [
                                                    {
                                                              'text': `@${packageInfo.name}-modules/core`,
                                                              'link': `https://npmjs.com/package/@${packageInfo.name}-modules/core`
                                                    }
                                          ]
                                }
                      ],
                      'sidebar': {
                                '/ru/modules/Canvas/': [
                                          {
                                                    'text': 'Canvas Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Canvas',
                                                                        'link': '/ru/modules/Canvas/Canvas'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/core/': [
                                          {
                                                    'text': 'Модули core',
                                                    'items': coreSidebarItems.map(item => ({
                                                              text: item.text,
                                                              link: `/ru${item.link}`
                                                    }))
                                          }
                                ],
                                '/ru/modules/platform/': [
                                          {
                                                    'text': 'platform Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Platform',
                                                                        'link': '/ru/modules/platform/platform'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/': [
                                          {
                                                    'text': 'Canvas Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Canvas',
                                                                        'link': '/ru/modules/Canvas/Canvas'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Модули core',
                                                    'items': coreSidebarItems.map(item => ({
                                                              text: item.text,
                                                              link: `/ru${item.link}`
                                                    }))
                                          },
                                          {
                                                    'text': 'platform Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Platform',
                                                                        'link': '/ru/modules/platform/platform'
                                                              }
                                                    ]
                                          }
                                ]
                      }
            }
        }
    },

    themeConfig: {
                'nav': [
                        {
                                'text': 'Modules',
                                'link': '/modules/'
                        },
                        {
                                'text': 'NPM',
                                'items': [
                                        {
                                                'text': `@${packageInfo.name}-modules/core`,
                                                'link': `https://npmjs.com/package/@${packageInfo.name}-modules/core`
                                        }
                                ]
                        }
                ],
                'sidebar': {
                        '/modules/Canvas/': [
                                {
                                        'text': 'Canvas Modules',
                                        'items': [
                                                {
                                                        'text': 'Canvas',
                                                        'link': '/modules/Canvas/Canvas'
                                                }
                                        ]
                                }
                        ],
                        '/modules/core/': [
                                {
                                        'text': 'core Modules',
                                        'items': coreSidebarItems
                                }
                        ],
                        '/modules/platform/': [
                                {
                                        'text': 'platform Modules',
                                        'items': [
                                                {
                                                        'text': 'Platform',
                                                        'link': '/modules/platform/platform'
                                                }
                                        ]
                                }
                        ],
                        '/modules/': [
                                {
                                        'text': 'Canvas Modules',
                                        'items': [
                                                {
                                                        'text': 'Canvas',
                                                        'link': '/modules/Canvas/Canvas'
                                                }
                                        ]
                                },
                                {
                                        'text': 'core Modules',
                                        'items': coreSidebarItems
                                },
                                {
                                        'text': 'platform Modules',
                                        'items': [
                                                {
                                                        'text': 'Platform',
                                                        'link': '/modules/platform/platform'
                                                }
                                        ]
                                }
                        ]
                },
                'socialLinks': [
                        {
                                'icon': 'github',
                                'link': `https://github.com/empty-set-dev/${packageInfo.name}-modules`
                        },
                        {
                                'icon': 'npm',
                                'link': `https://npmjs.com/~${packageInfo.name}-modules`
                        }
                ],
                'footer': {
                        'message': 'Released under the ISC License.',
                        'copyright': 'Copyright © 2025 Anya Sky'
                },
                'search': {
                        'provider': 'local'
                },
                'editLink': {
                        'pattern': `https://github.com/empty-set-dev/${packageInfo.name}-modules/edit/main/docs/:path`
                }
        },

    vite: {
        resolve: {
            alias: {
                '@': resolve(__dirname, '../../'),
                [packageInfo.name]: resolve(__dirname, '../../')
            }
        },
        server: {
            fs: {
                allow: [resolve(__dirname, '../../')],
                strict: false
            },
            watch: {
                ignored: [
                    '**/playground/**',
                    '**/canvas/examples/**',
                    '**/cli/boilerplates/**',
                    '**/.dev/**',
                    '**/node_modules/**'
                ]
            }
        },
        optimizeDeps: {
            exclude: ['playground', 'canvas/examples', 'cli/boilerplates'],
            // Don't scan HTML files - VitePress doesn't need them
            entries: [],
            force: false
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