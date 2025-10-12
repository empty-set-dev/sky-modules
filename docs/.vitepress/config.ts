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
                      'nav': [
                                {
                                          'text': 'Руководство',
                                          'link': '/ru/guide/getting-started'
                                },
                                {
                                          'text': 'Модули',
                                          'link': '/ru/modules/'
                                },
                                {
                                          'text': 'Примеры',
                                          'link': '/ru/playground/'
                                },
                                {
                                          'text': 'Песочница',
                                          'link': '/ru/playground/'
                                },
                                {
                                          'text': 'NPM',
                                          'items': [
                                                    {
                                                              'text': `@${packageInfo.name}-modules/core`,
                                                              'link': `https://npmjs.com/package/@${packageInfo.name}-modules/core`
                                                    },
                                                    {
                                                              'text': 'Все пакеты',
                                                              'link': '/ru/packages/'
                                                    }
                                          ]
                                }
                      ],
                      'sidebar': {
                                '/ru/modules/core/': [
                                          {
                                                    'text': 'Модули core',
                                                    'items': [
                                                              {
                                                                        'text': 'Array',
                                                                        'link': '/ru/modules/core/Array'
                                                              },
                                                              {
                                                                        'text': 'mergeNamespace',
                                                                        'link': '/ru/modules/core/mergeNamespace'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/': [
                                          {
                                                    'text': 'behavior Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'reactive',
                                                                        'link': '/ru/modules/behavior/reactive'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'cli Modules',
                                                    'items': [
                                                              {
                                                                        'text': '.',
                                                                        'link': '/ru/modules/cli/.'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Модули core',
                                                    'items': [
                                                              {
                                                                        'text': 'Array',
                                                                        'link': '/ru/modules/core/Array'
                                                              },
                                                              {
                                                                        'text': 'bind',
                                                                        'link': '/ru/modules/core/bind'
                                                              },
                                                              {
                                                                        'text': 'mergeNamespace',
                                                                        'link': '/ru/modules/core/mergeNamespace'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'design Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'index.css',
                                                                        'link': '/ru/modules/design/index.css'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'helpers Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'cn',
                                                                        'link': '/ru/modules/helpers/cn'
                                                              },
                                                              {
                                                                        'text': 'Loop',
                                                                        'link': '/ru/modules/helpers/Loop'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'math Modules',
                                                    'items': [
                                                              {
                                                                        'text': '.',
                                                                        'link': '/ru/modules/math/.'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'platform Modules',
                                                    'items': [
                                                              {
                                                                        'text': '.',
                                                                        'link': '/ru/modules/platform/.'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'qwik Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Box',
                                                                        'link': '/ru/modules/qwik/Box'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'react Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'UniversalReactAppService',
                                                                        'link': '/ru/modules/react/UniversalReactAppService'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'universal Modules',
                                                    'items': [
                                                              {
                                                                        'text': '.',
                                                                        'link': '/ru/modules/universal/.'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'utilities Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'times',
                                                                        'link': '/ru/modules/utilities/times'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'web Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'HTML_TAGS',
                                                                        'link': '/ru/modules/web/HTML_TAGS'
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
                                'text': 'Guide',
                                'link': '/guide/getting-started'
                        },
                        {
                                'text': 'Modules',
                                'link': '/modules/'
                        },
                        {
                                'text': 'Examples',
                                'link': '/playground/'
                        },
                        {
                                'text': 'Playground',
                                'link': '/playground/'
                        },
                        {
                                'text': 'NPM',
                                'items': [
                                        {
                                                'text': '__PACKAGE_NAME__',
                                                'link': '__PACKAGE_LINK__'
                                        },
                                        {
                                                'text': 'All packages',
                                                'link': '/packages/'
                                        }
                                ]
                        }
                ],
                'sidebar': {
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
                                        'text': 'behavior Modules',
                                        'items': [
                                                {
                                                        'text': 'reactive',
                                                        'link': '/modules/behavior/reactive'
                                                }
                                        ]
                                },
                                {
                                        'text': 'cli Modules',
                                        'items': [
                                                {
                                                        'text': '.',
                                                        'link': '/modules/cli/.'
                                                }
                                        ]
                                },
                                {
                                        'text': 'core Modules',
                                        'items': [
                                                {
                                                        'text': 'Array',
                                                        'link': '/modules/core/Array'
                                                },
                                                {
                                                        'text': 'bind',
                                                        'link': '/modules/core/bind'
                                                },
                                                {
                                                        'text': 'mergeNamespace',
                                                        'link': '/modules/core/mergeNamespace'
                                                }
                                        ]
                                },
                                {
                                        'text': 'design Modules',
                                        'items': [
                                                {
                                                        'text': 'index.css',
                                                        'link': '/modules/design/index.css'
                                                }
                                        ]
                                },
                                {
                                        'text': 'helpers Modules',
                                        'items': [
                                                {
                                                        'text': 'cn',
                                                        'link': '/modules/helpers/cn'
                                                },
                                                {
                                                        'text': 'Loop',
                                                        'link': '/modules/helpers/Loop'
                                                }
                                        ]
                                },
                                {
                                        'text': 'math Modules',
                                        'items': [
                                                {
                                                        'text': '.',
                                                        'link': '/modules/math/.'
                                                }
                                        ]
                                },
                                {
                                        'text': 'platform Modules',
                                        'items': [
                                                {
                                                        'text': '.',
                                                        'link': '/modules/platform/.'
                                                }
                                        ]
                                },
                                {
                                        'text': 'qwik Modules',
                                        'items': [
                                                {
                                                        'text': 'Box',
                                                        'link': '/modules/qwik/Box'
                                                }
                                        ]
                                },
                                {
                                        'text': 'react Modules',
                                        'items': [
                                                {
                                                        'text': 'UniversalReactAppService',
                                                        'link': '/modules/react/UniversalReactAppService'
                                                }
                                        ]
                                },
                                {
                                        'text': 'universal Modules',
                                        'items': [
                                                {
                                                        'text': '.',
                                                        'link': '/modules/universal/.'
                                                }
                                        ]
                                },
                                {
                                        'text': 'utilities Modules',
                                        'items': [
                                                {
                                                        'text': 'times',
                                                        'link': '/modules/utilities/times'
                                                }
                                        ]
                                },
                                {
                                        'text': 'web Modules',
                                        'items': [
                                                {
                                                        'text': 'HTML_TAGS',
                                                        'link': '/modules/web/HTML_TAGS'
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