import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Dynamic configuration helpers
function getPackageInfo() {
    const packagePath = join(fileURLToPath(new URL('../../', import.meta.url)), 'package.json')
    if (existsSync(packagePath)) {
        const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
        const name = packageJson.name || 'project'
        // Capitalize first letter for display (e.g., "sky" -> "Sky")
        const displayName = name.charAt(0).toUpperCase() + name.slice(1)
        return {
            name: name,                    // Original for URLs and paths
            displayName: displayName,      // Capitalized for display
            description: packageJson.description || 'Project documentation'
        }
    }
    return { name: 'project', displayName: 'Project', description: 'Project documentation' }
}

const packageInfo = getPackageInfo()

export default defineConfig({
    title: `${packageInfo.displayName} Modules`,
    description: packageInfo.description,
    base: `/${packageInfo.name}-modules/`,
    ignoreDeadLinks: true,

    // Multi-language configuration
    locales: {
        root: {
            label: 'English',
            lang: 'en',
            title: `${packageInfo.displayName} Modules`,
            description: packageInfo.description
        },
        ru: {
            label: 'Русский',
            lang: 'ru',
            title: `${packageInfo.displayName} Modules`,
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
                                '/ru/modules/canvas/': [
                                          {
                                                    'text': 'Canvas Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Canvas',
                                                                        'link': '/ru/modules/canvas/canvas'
                                                              },
                                                              {
                                                                        'text': 'core',
                                                                        'link': '/ru/modules/canvas/core'
                                                              },
                                                              {
                                                                        'text': 'core / renderers',
                                                                        'link': '/ru/modules/canvas/core-renderers'
                                                              },
                                                              {
                                                                        'text': 'core / styles',
                                                                        'link': '/ru/modules/canvas/core-styles'
                                                              },
                                                              {
                                                                        'text': 'geometries',
                                                                        'link': '/ru/modules/canvas/geometries'
                                                              },
                                                              {
                                                                        'text': 'jsx',
                                                                        'link': '/ru/modules/canvas/jsx'
                                                              },
                                                              {
                                                                        'text': 'jsx / utils',
                                                                        'link': '/ru/modules/canvas/jsx-utils'
                                                              },
                                                              {
                                                                        'text': 'materials',
                                                                        'link': '/ru/modules/canvas/materials'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/cli/': [
                                          {
                                                    'text': 'Cli Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'mitosis / framework-generators',
                                                                        'link': '/ru/modules/cli/mitosis-framework-generators'
                                                              },
                                                              {
                                                                        'text': 'mitosis / utils',
                                                                        'link': '/ru/modules/cli/mitosis-utils'
                                                              },
                                                              {
                                                                        'text': 'test-utils',
                                                                        'link': '/ru/modules/cli/test-utils'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/core/': [
                                          {
                                                    'text': 'Core Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Core',
                                                                        'link': '/ru/modules/core/core'
                                                              },
                                                              {
                                                                        'text': 'Array',
                                                                        'link': '/ru/modules/core/Array'
                                                              },
                                                              {
                                                                        'text': 'Callback',
                                                                        'link': '/ru/modules/core/Callback'
                                                              },
                                                              {
                                                                        'text': 'Class',
                                                                        'link': '/ru/modules/core/Class'
                                                              },
                                                              {
                                                                        'text': 'Console',
                                                                        'link': '/ru/modules/core/Console'
                                                              },
                                                              {
                                                                        'text': 'EventEmitter',
                                                                        'link': '/ru/modules/core/EventEmitter'
                                                              },
                                                              {
                                                                        'text': 'Map',
                                                                        'link': '/ru/modules/core/Map'
                                                              },
                                                              {
                                                                        'text': 'Math',
                                                                        'link': '/ru/modules/core/Math'
                                                              },
                                                              {
                                                                        'text': 'Object',
                                                                        'link': '/ru/modules/core/Object'
                                                              },
                                                              {
                                                                        'text': 'PromisePool',
                                                                        'link': '/ru/modules/core/PromisePool'
                                                              },
                                                              {
                                                                        'text': 'assert',
                                                                        'link': '/ru/modules/core/assert'
                                                              },
                                                              {
                                                                        'text': 'assume',
                                                                        'link': '/ru/modules/core/assume'
                                                              },
                                                              {
                                                                        'text': 'async',
                                                                        'link': '/ru/modules/core/async'
                                                              },
                                                              {
                                                                        'text': 'async-creation',
                                                                        'link': '/ru/modules/core/async-creation'
                                                              },
                                                              {
                                                                        'text': 'bind',
                                                                        'link': '/ru/modules/core/bind'
                                                              },
                                                              {
                                                                        'text': 'canClone',
                                                                        'link': '/ru/modules/core/canClone'
                                                              },
                                                              {
                                                                        'text': 'deferred',
                                                                        'link': '/ru/modules/core/deferred'
                                                              },
                                                              {
                                                                        'text': 'define',
                                                                        'link': '/ru/modules/core/define'
                                                              },
                                                              {
                                                                        'text': 'defineMeasures',
                                                                        'link': '/ru/modules/core/defineMeasures'
                                                              },
                                                              {
                                                                        'text': 'disposable',
                                                                        'link': '/ru/modules/core/disposable'
                                                              },
                                                              {
                                                                        'text': 'env',
                                                                        'link': '/ru/modules/core/env'
                                                              },
                                                              {
                                                                        'text': 'errors',
                                                                        'link': '/ru/modules/core/errors'
                                                              },
                                                              {
                                                                        'text': 'events',
                                                                        'link': '/ru/modules/core/events'
                                                              },
                                                              {
                                                                        'text': 'fetch',
                                                                        'link': '/ru/modules/core/fetch'
                                                              },
                                                              {
                                                                        'text': 'globalify',
                                                                        'link': '/ru/modules/core/globalify'
                                                              },
                                                              {
                                                                        'text': 'hmr',
                                                                        'link': '/ru/modules/core/hmr'
                                                              },
                                                              {
                                                                        'text': 'hooks',
                                                                        'link': '/ru/modules/core/hooks'
                                                              },
                                                              {
                                                                        'text': 'idle',
                                                                        'link': '/ru/modules/core/idle'
                                                              },
                                                              {
                                                                        'text': 'justTry',
                                                                        'link': '/ru/modules/core/justTry'
                                                              },
                                                              {
                                                                        'text': 'measures',
                                                                        'link': '/ru/modules/core/measures'
                                                              },
                                                              {
                                                                        'text': 'mergeNamespace',
                                                                        'link': '/ru/modules/core/mergeNamespace'
                                                              },
                                                              {
                                                                        'text': 'mixin',
                                                                        'link': '/ru/modules/core/mixin'
                                                              },
                                                              {
                                                                        'text': 'mode',
                                                                        'link': '/ru/modules/core/mode'
                                                              },
                                                              {
                                                                        'text': 'not',
                                                                        'link': '/ru/modules/core/not'
                                                              },
                                                              {
                                                                        'text': 'repeat',
                                                                        'link': '/ru/modules/core/repeat'
                                                              },
                                                              {
                                                                        'text': 'runtime',
                                                                        'link': '/ru/modules/core/runtime'
                                                              },
                                                              {
                                                                        'text': 'switch_thread',
                                                                        'link': '/ru/modules/core/switch_thread'
                                                              },
                                                              {
                                                                        'text': 'transform',
                                                                        'link': '/ru/modules/core/transform'
                                                              },
                                                              {
                                                                        'text': 'type-guards',
                                                                        'link': '/ru/modules/core/type-guards'
                                                              },
                                                              {
                                                                        'text': 'utility-types',
                                                                        'link': '/ru/modules/core/utility-types'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/design/': [
                                          {
                                                    'text': 'Design Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Design',
                                                                        'link': '/ru/modules/design/design'
                                                              },
                                                              {
                                                                        'text': 'Box',
                                                                        'link': '/ru/modules/design/Box'
                                                              },
                                                              {
                                                                        'text': 'Brand',
                                                                        'link': '/ru/modules/design/Brand'
                                                              },
                                                              {
                                                                        'text': 'DesignSystem',
                                                                        'link': '/ru/modules/design/DesignSystem'
                                                              },
                                                              {
                                                                        'text': 'Layout',
                                                                        'link': '/ru/modules/design/Layout'
                                                              },
                                                              {
                                                                        'text': 'brands',
                                                                        'link': '/ru/modules/design/brands'
                                                              },
                                                              {
                                                                        'text': 'colors',
                                                                        'link': '/ru/modules/design/colors'
                                                              },
                                                              {
                                                                        'text': 'lib',
                                                                        'link': '/ru/modules/design/lib'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/platform/': [
                                          {
                                                    'text': 'Platform Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Platform',
                                                                        'link': '/ru/modules/platform/platform'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/react/': [
                                          {
                                                    'text': 'React Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'React',
                                                                        'link': '/ru/modules/react/react'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/solid/': [
                                          {
                                                    'text': 'Solid Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Solid',
                                                                        'link': '/ru/modules/solid/solid'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/svelte/': [
                                          {
                                                    'text': 'Svelte Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Svelte',
                                                                        'link': '/ru/modules/svelte/svelte'
                                                              }
                                                    ]
                                          }
                                ],
                                '/ru/modules/universal/': [
                                          {
                                                    'text': 'Universal Modules',
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
                                                    'text': 'Vue Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Vue',
                                                                        'link': '/ru/modules/vue/vue'
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
                                                                        'link': '/ru/modules/canvas/canvas'
                                                              },
                                                              {
                                                                        'text': 'core',
                                                                        'link': '/ru/modules/canvas/core'
                                                              },
                                                              {
                                                                        'text': 'geometries',
                                                                        'link': '/ru/modules/canvas/geometries'
                                                              },
                                                              {
                                                                        'text': 'jsx',
                                                                        'link': '/ru/modules/canvas/jsx'
                                                              },
                                                              {
                                                                        'text': 'materials',
                                                                        'link': '/ru/modules/canvas/materials'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Cli Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'test-utils',
                                                                        'link': '/ru/modules/cli/test-utils'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Core Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Core',
                                                                        'link': '/ru/modules/core/core'
                                                              },
                                                              {
                                                                        'text': 'Array',
                                                                        'link': '/ru/modules/core/Array'
                                                              },
                                                              {
                                                                        'text': 'Callback',
                                                                        'link': '/ru/modules/core/Callback'
                                                              },
                                                              {
                                                                        'text': 'Class',
                                                                        'link': '/ru/modules/core/Class'
                                                              },
                                                              {
                                                                        'text': 'Console',
                                                                        'link': '/ru/modules/core/Console'
                                                              },
                                                              {
                                                                        'text': 'EventEmitter',
                                                                        'link': '/ru/modules/core/EventEmitter'
                                                              },
                                                              {
                                                                        'text': 'Map',
                                                                        'link': '/ru/modules/core/Map'
                                                              },
                                                              {
                                                                        'text': 'Math',
                                                                        'link': '/ru/modules/core/Math'
                                                              },
                                                              {
                                                                        'text': 'Object',
                                                                        'link': '/ru/modules/core/Object'
                                                              },
                                                              {
                                                                        'text': 'PromisePool',
                                                                        'link': '/ru/modules/core/PromisePool'
                                                              },
                                                              {
                                                                        'text': 'assert',
                                                                        'link': '/ru/modules/core/assert'
                                                              },
                                                              {
                                                                        'text': 'assume',
                                                                        'link': '/ru/modules/core/assume'
                                                              },
                                                              {
                                                                        'text': 'async',
                                                                        'link': '/ru/modules/core/async'
                                                              },
                                                              {
                                                                        'text': 'async-creation',
                                                                        'link': '/ru/modules/core/async-creation'
                                                              },
                                                              {
                                                                        'text': 'bind',
                                                                        'link': '/ru/modules/core/bind'
                                                              },
                                                              {
                                                                        'text': 'canClone',
                                                                        'link': '/ru/modules/core/canClone'
                                                              },
                                                              {
                                                                        'text': 'deferred',
                                                                        'link': '/ru/modules/core/deferred'
                                                              },
                                                              {
                                                                        'text': 'define',
                                                                        'link': '/ru/modules/core/define'
                                                              },
                                                              {
                                                                        'text': 'defineMeasures',
                                                                        'link': '/ru/modules/core/defineMeasures'
                                                              },
                                                              {
                                                                        'text': 'disposable',
                                                                        'link': '/ru/modules/core/disposable'
                                                              },
                                                              {
                                                                        'text': 'env',
                                                                        'link': '/ru/modules/core/env'
                                                              },
                                                              {
                                                                        'text': 'errors',
                                                                        'link': '/ru/modules/core/errors'
                                                              },
                                                              {
                                                                        'text': 'events',
                                                                        'link': '/ru/modules/core/events'
                                                              },
                                                              {
                                                                        'text': 'fetch',
                                                                        'link': '/ru/modules/core/fetch'
                                                              },
                                                              {
                                                                        'text': 'globalify',
                                                                        'link': '/ru/modules/core/globalify'
                                                              },
                                                              {
                                                                        'text': 'hmr',
                                                                        'link': '/ru/modules/core/hmr'
                                                              },
                                                              {
                                                                        'text': 'hooks',
                                                                        'link': '/ru/modules/core/hooks'
                                                              },
                                                              {
                                                                        'text': 'idle',
                                                                        'link': '/ru/modules/core/idle'
                                                              },
                                                              {
                                                                        'text': 'justTry',
                                                                        'link': '/ru/modules/core/justTry'
                                                              },
                                                              {
                                                                        'text': 'measures',
                                                                        'link': '/ru/modules/core/measures'
                                                              },
                                                              {
                                                                        'text': 'mergeNamespace',
                                                                        'link': '/ru/modules/core/mergeNamespace'
                                                              },
                                                              {
                                                                        'text': 'mixin',
                                                                        'link': '/ru/modules/core/mixin'
                                                              },
                                                              {
                                                                        'text': 'mode',
                                                                        'link': '/ru/modules/core/mode'
                                                              },
                                                              {
                                                                        'text': 'not',
                                                                        'link': '/ru/modules/core/not'
                                                              },
                                                              {
                                                                        'text': 'repeat',
                                                                        'link': '/ru/modules/core/repeat'
                                                              },
                                                              {
                                                                        'text': 'runtime',
                                                                        'link': '/ru/modules/core/runtime'
                                                              },
                                                              {
                                                                        'text': 'switch_thread',
                                                                        'link': '/ru/modules/core/switch_thread'
                                                              },
                                                              {
                                                                        'text': 'transform',
                                                                        'link': '/ru/modules/core/transform'
                                                              },
                                                              {
                                                                        'text': 'type-guards',
                                                                        'link': '/ru/modules/core/type-guards'
                                                              },
                                                              {
                                                                        'text': 'utility-types',
                                                                        'link': '/ru/modules/core/utility-types'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Design Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Design',
                                                                        'link': '/ru/modules/design/design'
                                                              },
                                                              {
                                                                        'text': 'Box',
                                                                        'link': '/ru/modules/design/Box'
                                                              },
                                                              {
                                                                        'text': 'Brand',
                                                                        'link': '/ru/modules/design/Brand'
                                                              },
                                                              {
                                                                        'text': 'Design',
                                                                        'link': '/ru/modules/design/Design'
                                                              },
                                                              {
                                                                        'text': 'DesignSystem',
                                                                        'link': '/ru/modules/design/DesignSystem'
                                                              },
                                                              {
                                                                        'text': 'Layout',
                                                                        'link': '/ru/modules/design/Layout'
                                                              },
                                                              {
                                                                        'text': 'brands',
                                                                        'link': '/ru/modules/design/brands'
                                                              },
                                                              {
                                                                        'text': 'colors',
                                                                        'link': '/ru/modules/design/colors'
                                                              },
                                                              {
                                                                        'text': 'lib',
                                                                        'link': '/ru/modules/design/lib'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Platform Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Platform',
                                                                        'link': '/ru/modules/platform/platform'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'React Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'React',
                                                                        'link': '/ru/modules/react/react'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Solid Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Solid',
                                                                        'link': '/ru/modules/solid/solid'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Svelte Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Svelte',
                                                                        'link': '/ru/modules/svelte/svelte'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Universal Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Universal',
                                                                        'link': '/ru/modules/universal/universal'
                                                              }
                                                    ]
                                          },
                                          {
                                                    'text': 'Vue Modules',
                                                    'items': [
                                                              {
                                                                        'text': 'Vue',
                                                                        'link': '/ru/modules/vue/vue'
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
                        '/modules/canvas/': [
                                {
                                        'text': 'Canvas Modules',
                                        'items': [
                                                {
                                                        'text': 'Canvas',
                                                        'link': '/modules/canvas/canvas'
                                                },
                                                {
                                                        'text': 'core',
                                                        'link': '/modules/canvas/core'
                                                },
                                                {
                                                        'text': 'core / renderers',
                                                        'link': '/modules/canvas/core-renderers'
                                                },
                                                {
                                                        'text': 'core / styles',
                                                        'link': '/modules/canvas/core-styles'
                                                },
                                                {
                                                        'text': 'geometries',
                                                        'link': '/modules/canvas/geometries'
                                                },
                                                {
                                                        'text': 'jsx',
                                                        'link': '/modules/canvas/jsx'
                                                },
                                                {
                                                        'text': 'jsx / utils',
                                                        'link': '/modules/canvas/jsx-utils'
                                                },
                                                {
                                                        'text': 'materials',
                                                        'link': '/modules/canvas/materials'
                                                }
                                        ]
                                }
                        ],
                        '/modules/cli/': [
                                {
                                        'text': 'Cli Modules',
                                        'items': [
                                                {
                                                        'text': 'mitosis / framework-generators',
                                                        'link': '/modules/cli/mitosis-framework-generators'
                                                },
                                                {
                                                        'text': 'mitosis / utils',
                                                        'link': '/modules/cli/mitosis-utils'
                                                },
                                                {
                                                        'text': 'test-utils',
                                                        'link': '/modules/cli/test-utils'
                                                }
                                        ]
                                }
                        ],
                        '/modules/core/': [
                                {
                                        'text': 'Core Modules',
                                        'items': [
                                                {
                                                        'text': 'Core',
                                                        'link': '/modules/core/core'
                                                },
                                                {
                                                        'text': 'Array',
                                                        'link': '/modules/core/Array'
                                                },
                                                {
                                                        'text': 'Callback',
                                                        'link': '/modules/core/Callback'
                                                },
                                                {
                                                        'text': 'Class',
                                                        'link': '/modules/core/Class'
                                                },
                                                {
                                                        'text': 'Console',
                                                        'link': '/modules/core/Console'
                                                },
                                                {
                                                        'text': 'EventEmitter',
                                                        'link': '/modules/core/EventEmitter'
                                                },
                                                {
                                                        'text': 'Map',
                                                        'link': '/modules/core/Map'
                                                },
                                                {
                                                        'text': 'Math',
                                                        'link': '/modules/core/Math'
                                                },
                                                {
                                                        'text': 'Object',
                                                        'link': '/modules/core/Object'
                                                },
                                                {
                                                        'text': 'PromisePool',
                                                        'link': '/modules/core/PromisePool'
                                                },
                                                {
                                                        'text': 'assert',
                                                        'link': '/modules/core/assert'
                                                },
                                                {
                                                        'text': 'assume',
                                                        'link': '/modules/core/assume'
                                                },
                                                {
                                                        'text': 'async',
                                                        'link': '/modules/core/async'
                                                },
                                                {
                                                        'text': 'async-creation',
                                                        'link': '/modules/core/async-creation'
                                                },
                                                {
                                                        'text': 'bind',
                                                        'link': '/modules/core/bind'
                                                },
                                                {
                                                        'text': 'canClone',
                                                        'link': '/modules/core/canClone'
                                                },
                                                {
                                                        'text': 'deferred',
                                                        'link': '/modules/core/deferred'
                                                },
                                                {
                                                        'text': 'define',
                                                        'link': '/modules/core/define'
                                                },
                                                {
                                                        'text': 'defineMeasures',
                                                        'link': '/modules/core/defineMeasures'
                                                },
                                                {
                                                        'text': 'disposable',
                                                        'link': '/modules/core/disposable'
                                                },
                                                {
                                                        'text': 'env',
                                                        'link': '/modules/core/env'
                                                },
                                                {
                                                        'text': 'errors',
                                                        'link': '/modules/core/errors'
                                                },
                                                {
                                                        'text': 'events',
                                                        'link': '/modules/core/events'
                                                },
                                                {
                                                        'text': 'fetch',
                                                        'link': '/modules/core/fetch'
                                                },
                                                {
                                                        'text': 'globalify',
                                                        'link': '/modules/core/globalify'
                                                },
                                                {
                                                        'text': 'hmr',
                                                        'link': '/modules/core/hmr'
                                                },
                                                {
                                                        'text': 'hooks',
                                                        'link': '/modules/core/hooks'
                                                },
                                                {
                                                        'text': 'idle',
                                                        'link': '/modules/core/idle'
                                                },
                                                {
                                                        'text': 'justTry',
                                                        'link': '/modules/core/justTry'
                                                },
                                                {
                                                        'text': 'measures',
                                                        'link': '/modules/core/measures'
                                                },
                                                {
                                                        'text': 'mergeNamespace',
                                                        'link': '/modules/core/mergeNamespace'
                                                },
                                                {
                                                        'text': 'mixin',
                                                        'link': '/modules/core/mixin'
                                                },
                                                {
                                                        'text': 'mode',
                                                        'link': '/modules/core/mode'
                                                },
                                                {
                                                        'text': 'not',
                                                        'link': '/modules/core/not'
                                                },
                                                {
                                                        'text': 'repeat',
                                                        'link': '/modules/core/repeat'
                                                },
                                                {
                                                        'text': 'runtime',
                                                        'link': '/modules/core/runtime'
                                                },
                                                {
                                                        'text': 'switch_thread',
                                                        'link': '/modules/core/switch_thread'
                                                },
                                                {
                                                        'text': 'transform',
                                                        'link': '/modules/core/transform'
                                                },
                                                {
                                                        'text': 'type-guards',
                                                        'link': '/modules/core/type-guards'
                                                },
                                                {
                                                        'text': 'utility-types',
                                                        'link': '/modules/core/utility-types'
                                                }
                                        ]
                                }
                        ],
                        '/modules/design/': [
                                {
                                        'text': 'Design Modules',
                                        'items': [
                                                {
                                                        'text': 'Design',
                                                        'link': '/modules/design/design'
                                                },
                                                {
                                                        'text': 'Box',
                                                        'link': '/modules/design/Box'
                                                },
                                                {
                                                        'text': 'Brand',
                                                        'link': '/modules/design/Brand'
                                                },
                                                {
                                                        'text': 'DesignSystem',
                                                        'link': '/modules/design/DesignSystem'
                                                },
                                                {
                                                        'text': 'Layout',
                                                        'link': '/modules/design/Layout'
                                                },
                                                {
                                                        'text': 'brands',
                                                        'link': '/modules/design/brands'
                                                },
                                                {
                                                        'text': 'colors',
                                                        'link': '/modules/design/colors'
                                                },
                                                {
                                                        'text': 'lib',
                                                        'link': '/modules/design/lib'
                                                }
                                        ]
                                }
                        ],
                        '/modules/platform/': [
                                {
                                        'text': 'Platform Modules',
                                        'items': [
                                                {
                                                        'text': 'Platform',
                                                        'link': '/modules/platform/platform'
                                                }
                                        ]
                                }
                        ],
                        '/modules/react/': [
                                {
                                        'text': 'React Modules',
                                        'items': [
                                                {
                                                        'text': 'React',
                                                        'link': '/modules/react/react'
                                                }
                                        ]
                                }
                        ],
                        '/modules/solid/': [
                                {
                                        'text': 'Solid Modules',
                                        'items': [
                                                {
                                                        'text': 'Solid',
                                                        'link': '/modules/solid/solid'
                                                }
                                        ]
                                }
                        ],
                        '/modules/svelte/': [
                                {
                                        'text': 'Svelte Modules',
                                        'items': [
                                                {
                                                        'text': 'Svelte',
                                                        'link': '/modules/svelte/svelte'
                                                }
                                        ]
                                }
                        ],
                        '/modules/universal/': [
                                {
                                        'text': 'Universal Modules',
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
                                        'text': 'Vue Modules',
                                        'items': [
                                                {
                                                        'text': 'Vue',
                                                        'link': '/modules/vue/vue'
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
                                                        'link': '/modules/canvas/canvas'
                                                },
                                                {
                                                        'text': 'core',
                                                        'link': '/modules/canvas/core'
                                                },
                                                {
                                                        'text': 'geometries',
                                                        'link': '/modules/canvas/geometries'
                                                },
                                                {
                                                        'text': 'jsx',
                                                        'link': '/modules/canvas/jsx'
                                                },
                                                {
                                                        'text': 'materials',
                                                        'link': '/modules/canvas/materials'
                                                }
                                        ]
                                },
                                {
                                        'text': 'Cli Modules',
                                        'items': [
                                                {
                                                        'text': 'test-utils',
                                                        'link': '/modules/cli/test-utils'
                                                }
                                        ]
                                },
                                {
                                        'text': 'Core Modules',
                                        'items': [
                                                {
                                                        'text': 'Core',
                                                        'link': '/modules/core/core'
                                                },
                                                {
                                                        'text': 'Array',
                                                        'link': '/modules/core/Array'
                                                },
                                                {
                                                        'text': 'Callback',
                                                        'link': '/modules/core/Callback'
                                                },
                                                {
                                                        'text': 'Class',
                                                        'link': '/modules/core/Class'
                                                },
                                                {
                                                        'text': 'Console',
                                                        'link': '/modules/core/Console'
                                                },
                                                {
                                                        'text': 'EventEmitter',
                                                        'link': '/modules/core/EventEmitter'
                                                },
                                                {
                                                        'text': 'Map',
                                                        'link': '/modules/core/Map'
                                                },
                                                {
                                                        'text': 'Math',
                                                        'link': '/modules/core/Math'
                                                },
                                                {
                                                        'text': 'Object',
                                                        'link': '/modules/core/Object'
                                                },
                                                {
                                                        'text': 'PromisePool',
                                                        'link': '/modules/core/PromisePool'
                                                },
                                                {
                                                        'text': 'assert',
                                                        'link': '/modules/core/assert'
                                                },
                                                {
                                                        'text': 'assume',
                                                        'link': '/modules/core/assume'
                                                },
                                                {
                                                        'text': 'async',
                                                        'link': '/modules/core/async'
                                                },
                                                {
                                                        'text': 'async-creation',
                                                        'link': '/modules/core/async-creation'
                                                },
                                                {
                                                        'text': 'bind',
                                                        'link': '/modules/core/bind'
                                                },
                                                {
                                                        'text': 'canClone',
                                                        'link': '/modules/core/canClone'
                                                },
                                                {
                                                        'text': 'deferred',
                                                        'link': '/modules/core/deferred'
                                                },
                                                {
                                                        'text': 'define',
                                                        'link': '/modules/core/define'
                                                },
                                                {
                                                        'text': 'defineMeasures',
                                                        'link': '/modules/core/defineMeasures'
                                                },
                                                {
                                                        'text': 'disposable',
                                                        'link': '/modules/core/disposable'
                                                },
                                                {
                                                        'text': 'env',
                                                        'link': '/modules/core/env'
                                                },
                                                {
                                                        'text': 'errors',
                                                        'link': '/modules/core/errors'
                                                },
                                                {
                                                        'text': 'events',
                                                        'link': '/modules/core/events'
                                                },
                                                {
                                                        'text': 'fetch',
                                                        'link': '/modules/core/fetch'
                                                },
                                                {
                                                        'text': 'globalify',
                                                        'link': '/modules/core/globalify'
                                                },
                                                {
                                                        'text': 'hmr',
                                                        'link': '/modules/core/hmr'
                                                },
                                                {
                                                        'text': 'hooks',
                                                        'link': '/modules/core/hooks'
                                                },
                                                {
                                                        'text': 'idle',
                                                        'link': '/modules/core/idle'
                                                },
                                                {
                                                        'text': 'justTry',
                                                        'link': '/modules/core/justTry'
                                                },
                                                {
                                                        'text': 'measures',
                                                        'link': '/modules/core/measures'
                                                },
                                                {
                                                        'text': 'mergeNamespace',
                                                        'link': '/modules/core/mergeNamespace'
                                                },
                                                {
                                                        'text': 'mixin',
                                                        'link': '/modules/core/mixin'
                                                },
                                                {
                                                        'text': 'mode',
                                                        'link': '/modules/core/mode'
                                                },
                                                {
                                                        'text': 'not',
                                                        'link': '/modules/core/not'
                                                },
                                                {
                                                        'text': 'repeat',
                                                        'link': '/modules/core/repeat'
                                                },
                                                {
                                                        'text': 'runtime',
                                                        'link': '/modules/core/runtime'
                                                },
                                                {
                                                        'text': 'switch_thread',
                                                        'link': '/modules/core/switch_thread'
                                                },
                                                {
                                                        'text': 'transform',
                                                        'link': '/modules/core/transform'
                                                },
                                                {
                                                        'text': 'type-guards',
                                                        'link': '/modules/core/type-guards'
                                                },
                                                {
                                                        'text': 'utility-types',
                                                        'link': '/modules/core/utility-types'
                                                }
                                        ]
                                },
                                {
                                        'text': 'Design Modules',
                                        'items': [
                                                {
                                                        'text': 'Design',
                                                        'link': '/modules/design/design'
                                                },
                                                {
                                                        'text': 'Box',
                                                        'link': '/modules/design/Box'
                                                },
                                                {
                                                        'text': 'Brand',
                                                        'link': '/modules/design/Brand'
                                                },
                                                {
                                                        'text': 'Design',
                                                        'link': '/modules/design/Design'
                                                },
                                                {
                                                        'text': 'DesignSystem',
                                                        'link': '/modules/design/DesignSystem'
                                                },
                                                {
                                                        'text': 'Layout',
                                                        'link': '/modules/design/Layout'
                                                },
                                                {
                                                        'text': 'brands',
                                                        'link': '/modules/design/brands'
                                                },
                                                {
                                                        'text': 'colors',
                                                        'link': '/modules/design/colors'
                                                },
                                                {
                                                        'text': 'lib',
                                                        'link': '/modules/design/lib'
                                                }
                                        ]
                                },
                                {
                                        'text': 'Platform Modules',
                                        'items': [
                                                {
                                                        'text': 'Platform',
                                                        'link': '/modules/platform/platform'
                                                }
                                        ]
                                },
                                {
                                        'text': 'React Modules',
                                        'items': [
                                                {
                                                        'text': 'React',
                                                        'link': '/modules/react/react'
                                                }
                                        ]
                                },
                                {
                                        'text': 'Solid Modules',
                                        'items': [
                                                {
                                                        'text': 'Solid',
                                                        'link': '/modules/solid/solid'
                                                }
                                        ]
                                },
                                {
                                        'text': 'Svelte Modules',
                                        'items': [
                                                {
                                                        'text': 'Svelte',
                                                        'link': '/modules/svelte/svelte'
                                                }
                                        ]
                                },
                                {
                                        'text': 'Universal Modules',
                                        'items': [
                                                {
                                                        'text': 'Universal',
                                                        'link': '/modules/universal/universal'
                                                }
                                        ]
                                },
                                {
                                        'text': 'Vue Modules',
                                        'items': [
                                                {
                                                        'text': 'Vue',
                                                        'link': '/modules/vue/vue'
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