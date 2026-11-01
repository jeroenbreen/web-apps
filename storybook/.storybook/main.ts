import type { StorybookConfig } from '@storybook/html-vite'

const config: StorybookConfig = {
  framework: '@storybook/html-vite',
  stories: ['../stories/**/*.stories.ts'],
  // The stories run on the source code: RequireJS loads apps/ and vendor/ as is.
  staticDirs: [
    { from: '../../apps', to: '/apps' },
    { from: '../../vendor', to: '/vendor' },
    { from: '../../theme', to: '/theme' },
    // app.less points to the images with a path relative to the editor page.
    { from: '../../apps/common', to: '/common' },
  ],
  core: { disableTelemetry: true },
}

export default config
