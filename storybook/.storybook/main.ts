import path from 'node:path'
import type { StorybookConfig } from '@storybook/vue3-vite'
import vue from '@vitejs/plugin-vue'

const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../stories/**/*.stories.ts'],
  // The Backbone stories run on the source code: RequireJS loads apps/ and vendor/ as is.
  staticDirs: [
    { from: '../../apps', to: '/apps' },
    { from: '../../vendor', to: '/vendor' },
    { from: '../../theme', to: '/theme' },
    // app.less points to the images with a path relative to the editor page.
    { from: '../../apps/common', to: '/common' },
  ],
  core: { disableTelemetry: true },
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), vue()],
    resolve: {
      ...config.resolve,
      // The Vue components live in apps/, outside this package.
      dedupe: ['vue', 'reka-ui'],
    },
    server: { ...config.server, fs: { allow: [path.resolve(import.meta.dirname, '../..')] } },
  }),
}

export default config
