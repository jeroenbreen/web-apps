/*
 * SPDX-FileCopyrightText: 2026 Euro-Office contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// Feature flag and loader for the components that moved to Vue. Turn the flag on
// in the browser console with localStorage.setItem('eo-vue-islands', '1').
define([], function () { 'use strict';

    Common.VueIslands = {
        isEnabled: function () {
            try {
                return window.localStorage.getItem('eo-vue-islands') === '1';
            } catch (e) {
                return false;
            }
        },

        // Goes through window.require so webpack leaves Vue out of the editor
        // bundles. A .js id is resolved against the page, and every page that
        // uses this sits three levels below the web-apps root.
        load: function (callback, errback) {
            window.require(['../../../apps/common/main/vue/dist/islands.js'], callback, errback);
        }
    };
});
