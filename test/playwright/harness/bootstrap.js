// Loads one component into an empty page, without the editor or a document
// server. index.html?component=rename-dialog loads adapters/rename-dialog.js,
// which publishes window.harness. See ../README.md.
require.config({
    baseUrl: '../../../apps/',
    paths: {
        'jquery'     : '../vendor/jquery/jquery.min',
        'underscore' : '../vendor/underscore/underscore',
        'backbone'   : '../vendor/backbone/backbone',
        'tip'        : 'common/main/lib/util/Tip'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        }
    }
});

require(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    // The app modules read these as globals.
    window.$ = window.jQuery = $;
    window._ = _;
    window.Backbone = Backbone;

    // Ambient state the components read at render time. The real modules would
    // pull in 'core' and the application bootstrap.
    window.Common = window.Common || {};
    Common.UI = Common.UI || {};
    Common.UI.Scaling = { currentRatio: function () { return 1; } };
    Common.Locale = {
        getCurrentLanguage: function () { return 'en'; },
        isCurrentLanguageRtl: function () { return false; }
    };
    Common.NotificationCenter = _.extend({}, Backbone.Events);

    var component = new URLSearchParams(location.search).get('component');
    // The app loads these up front: Tip extends the jQuery plugin from
    // mods/tooltip, and an EventBus adds fireEvent to every Backbone.View.
    require(['common/main/lib/core/application', 'common/main/lib/mods/tooltip'], function () {
        new Backbone.EventBus();

        // Wait for the app styling, which less.js compiles in the browser.
        less.pageLoadFinished.then(function () {
            // A .js id is resolved against this page instead of baseUrl.
            require(['adapters/' + component + '.js']);
        });
    });
});
