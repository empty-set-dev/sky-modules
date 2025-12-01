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
                                '/ru/modules/design/': [
                                          {
                                                    'text': 'design Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Design',
                                                                        'link': '/ru/modules/design/design'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/svelte/': [
                                          {
                                                    'text': 'svelte Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Svelte',
                                                                        'link': '/ru/modules/svelte/svelte'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/core/': [
                                          {
                                                    'text': 'Модули core',
                                                    'items': [
                                                              {
                                                                        'text': 'Core',
                                                                        'link': '/ru/modules/core/core'
                                                              },
                                                              {
                                                                        'text': 'env',
                                                                        'link': '/ru/modules/core/env'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/universal/': [
                                          {
                                                    'text': 'universal Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Universal',
                                                                        'link': '/ru/modules/universal/universal'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/vue/': [
                                          {
                                                    'text': 'vue Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Vue',
                                                                        'link': '/ru/modules/vue/vue'
                                                              }
                                                    ]
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
                                '/ru/modules/solid/': [
                                          {
                                                    'text': 'solid Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Solid',
                                                                        'link': '/ru/modules/solid/solid'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/canvas/': [
                                          {
                                                    'text': 'canvas Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Canvas',
                                                                        'link': '/ru/modules/canvas/canvas'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/react/': [
                                          {
                                                    'text': 'react Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'React',
                                                                        'link': '/ru/modules/react/react'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/': [
                                          {
                                                    'text': 'design Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Design',
                                                                        'link': '/ru/modules/design/design'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'svelte Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Svelte',
                                                                        'link': '/ru/modules/svelte/svelte'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Модули core',
                                                    'items': [
                                                              {
                                                                        'text': 'Core',
                                                                        'link': '/ru/modules/core/core'
                                                              },
                                                              {
                                                                        'text': 'env',
                                                                        'link': '/ru/modules/core/env'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'universal Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Universal',
                                                                        'link': '/ru/modules/universal/universal'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'vue Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Vue',
                                                                        'link': '/ru/modules/vue/vue'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'platform Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Platform',
                                                                        'link': '/ru/modules/platform/platform'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'solid Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Solid',
                                                                        'link': '/ru/modules/solid/solid'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'canvas Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Canvas',
                                                                        'link': '/ru/modules/canvas/canvas'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'react Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'React',
                                                                        'link': '/ru/modules/react/react'
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
                        '/modules/design/': [
                                {
                                        'text': 'design Modules',
                                        'items': [
                                                {
                                                        'text': 'Design',
                                                        'link': '/modules/design/design'
                                                }
                                        ]
                                }
                        ],
                        '/modules/svelte/': [
                                {
                                        'text': 'svelte Modules',
                                        'items': [
                                                {
                                                        'text': 'Svelte',
                                                        'link': '/modules/svelte/svelte'
                                                }
                                        ]
                                }
                        ],
                        '/modules/core/': [
                                {
                                        'text': 'core Modules',
                                        'items': [
                                                {
                                                        'text': 'Core',
                                                        'link': '/modules/core/core'
                                                },
                                                {
                                                        'text': 'env',
                                                        'link': '/modules/core/env'
                                                }
                                        ]
                                }
                        ],
                        '/modules/universal/': [
                                {
                                        'text': 'universal Modules',
                                        'items': [
                                                {
                                                        'text': 'Universal',
                                                        'link': '/modules/universal/universal'
                                                }
                                        ]
                                }
                        ],
                        '/modules/vue/': [
                                {
                                        'text': 'vue Modules',
                                        'items': [
                                                {
                                                        'text': 'Vue',
                                                        'link': '/modules/vue/vue'
                                                }
                                        ]
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
                        '/modules/solid/': [
                                {
                                        'text': 'solid Modules',
                                        'items': [
                                                {
                                                        'text': 'Solid',
                                                        'link': '/modules/solid/solid'
                                                }
                                        ]
                                }
                        ],
                        '/modules/canvas/': [
                                {
                                        'text': 'canvas Modules',
                                        'items': [
                                                {
                                                        'text': 'Canvas',
                                                        'link': '/modules/canvas/canvas'
                                                }
                                        ]
                                }
                        ],
                        '/modules/react/': [
                                {
                                        'text': 'react Modules',
                                        'items': [
                                                {
                                                        'text': 'React',
                                                        'link': '/modules/react/react'
                                                }
                                        ]
                                }
                        ],
                        '/modules/': [
                                {
                                        'text': 'design Modules',
                                        'items': [
                                                {
                                                        'text': 'Design',
                                                        'link': '/modules/design/design'
                                                }
                                        ]
                                },
                                {
                                        'text': 'svelte Modules',
                                        'items': [
                                                {
                                                        'text': 'Svelte',
                                                        'link': '/modules/svelte/svelte'
                                                }
                                        ]
                                },
                                {
                                        'text': 'core Modules',
                                        'items': [
                                                {
                                                        'text': 'Core',
                                                        'link': '/modules/core/core'
                                                },
                                                {
                                                        'text': 'env',
                                                        'link': '/modules/core/env'
                                                }
                                        ]
                                },
                                {
                                        'text': 'universal Modules',
                                        'items': [
                                                {
                                                        'text': 'Universal',
                                                        'link': '/modules/universal/universal'
                                                }
                                        ]
                                },
                                {
                                        'text': 'vue Modules',
                                        'items': [
                                                {
                                                        'text': 'Vue',
                                                        'link': '/modules/vue/vue'
                                                }
                                        ]
                                },
                                {
                                        'text': 'platform Modules',
                                        'items': [
                                                {
                                                        'text': 'Platform',
                                                        'link': '/modules/platform/platform'
                                                }
                                        ]
                                },
                                {
                                        'text': 'solid Modules',
                                        'items': [
                                                {
                                                        'text': 'Solid',
                                                        'link': '/modules/solid/solid'
                                                }
                                        ]
                                },
                                {
                                        'text': 'canvas Modules',
                                        'items': [
                                                {
                                                        'text': 'Canvas',
                                                        'link': '/modules/canvas/canvas'
                                                }
                                        ]
                                },
                                {
                                        'text': 'react Modules',
                                        'items': [
                                                {
                                                        'text': 'React',
                                                        'link': '/modules/react/react'
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