import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  title: 'Sky Modules',
  description: 'Powerful TypeScript utility modules for modern development',

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#00e676' }],
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
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Modules System', link: '/guide/modules-system' },
            { text: 'Global Integration', link: '/guide/global-integration' },
            { text: 'TypeScript Support', link: '/guide/typescript' }
          ]
        }
      ],
      '/modules/': [
        {
          text: 'Core Modules',
          items: [
            { text: 'mergeNamespace', link: '/modules/core/mergeNamespace' },
            { text: 'globalify', link: '/modules/core/globalify' },
            { text: 'canClone', link: '/modules/core/canClone' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/empty-set-games/sky-modules' },
      { icon: 'npm', link: 'https://npmjs.com/~sky-modules' }
    ],

    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © 2024 Anya Sky'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/empty-set-games/sky-modules/edit/main/docs/:path'
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