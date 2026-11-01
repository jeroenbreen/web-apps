/**
 * SPDX-FileCopyrightText: 2026 Euro-Office contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * Builds the Vue islands into one AMD file, separate from the editor bundles.
 *
 * common/main/lib/util/VueIslands.js loads this file at runtime when the flag is
 * on, so the editors don't carry Vue while it is off. The file ends up at
 * apps/common/main/vue/dist/ in the source tree and in the deploy tree, because
 * the dev version of the editor and the test harness run on the source tree.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';
import { ESBUILD_TARGET } from './browser-floor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = process.env.BUILD_ROOT
    ? path.join(path.resolve(process.env.BUILD_ROOT), 'web-apps')
    : path.resolve(__dirname, '..');

const env = process.env.NODE_ENV || 'production';

export default {
    mode: env,
    entry: path.resolve(__dirname, '../apps/common/main/vue/index.ts'),
    output: {
        path: path.join(ROOT, 'apps/common/main/vue/dist'),
        filename: 'islands.js',
        library: { type: 'amd' },
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        // Dependencies live in build/node_modules, outside the apps/ tree.
        modules: [path.resolve(__dirname, 'node_modules')],
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, 'node_modules')],
    },
    module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.ts$/, loader: 'esbuild-loader', options: { loader: 'ts', target: ESBUILD_TARGET } },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        }),
    ],
    devtool: env === 'production' ? false : 'source-map',
};
