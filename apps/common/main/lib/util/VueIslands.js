/*
 * SPDX-FileCopyrightText: 2026 Euro-Office contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// Reads the flags and loads the components that moved to Vue. The defaults are in
// featureFlags.js. Override one in the browser console with 1 or 0, for example
// localStorage.setItem('eo-vue-islands', '1') or 'eo-vue-islands-highlight'.
define([
    'common/main/lib/util/featureFlags'
], function (flags) { 'use strict';

    function isOn(key, fallback) {
        try {
            var value = window.localStorage.getItem(key);
            return value === null ? fallback : value === '1';
        } catch (e) {
            return fallback;
        }
    }

    Common.VueIslands = {
        isEnabled: function () {
            return isOn('eo-vue-islands', flags.vueIslands);
        },

        isHighlighted: function () {
            return isOn('eo-vue-islands-highlight', flags.highlightVueIslands);
        },

        // Goes through window.require so webpack leaves Vue out of the editor
        // bundles. A .js id is resolved against the page, and every page that
        // uses this sits three levels below the web-apps root.
        load: function (callback, errback) {
            document.documentElement.classList.toggle('eo-vue-islands-highlight', this.isHighlighted());
            window.require(['../../../apps/common/main/vue/dist/islands.js'], callback, errback);
        }
    };
});
