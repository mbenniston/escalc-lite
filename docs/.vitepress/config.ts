import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  rewrites: {
    'index.md': 'index.md',
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [groupIconVitePlugin() as any],
  },
  title: 'ESCalc Lite',
  description: 'escalc-lite documentation',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is ESCalc Lite?', link: '/' },
          { text: 'Getting started', link: '/getting-started' },
          { text: 'Supported features', link: '/supported-features' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Evaluate', link: '/evaluate' },
          { text: 'Parse & execute', link: '/parse-and-execute' },
          { text: 'Format', link: '/format' },
          { text: 'Parameters', link: '/parameters' },
          { text: 'Types', link: '/types' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Using decimal.js over number', link: '/decimaljs' },
          {
            text: 'Overriding evaluation behaviour',
            link: '/overriding-evaluation',
          },
        ],
      },
      {
        items: [{ text: 'Demo', link: '/demo.md' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mbenniston/escalc-lite' },
    ],
  },
})
