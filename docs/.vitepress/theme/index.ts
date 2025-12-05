// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PlaygroundLink from './components/PlaygroundLink.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('PlaygroundLink', PlaygroundLink)
  }
} satisfies Theme