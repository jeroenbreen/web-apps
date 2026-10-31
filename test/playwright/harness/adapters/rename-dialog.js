// Opens the Backbone RenameDialog the way controller/LeftMenu.js does. When the
// dialog moves to Vue only this file changes, the spec stays the same.
require([
    'common/main/lib/util/utils',
    'common/main/lib/component/Window',
    'common/main/lib/component/InputField'
], function () {
    // RenameDialog declares no dependencies, so load it after Window exists.
    Common.Views = Common.Views || {};
    require(['common/main/lib/view/RenameDialog'], function () {
        window.harness = {
            open: function (options) {
                return new Promise(function (resolve) {
                    new Common.Views.RenameDialog({
                        filename: options.filename,
                        maxLength: options.maxLength,
                        handler: function (result, value) {
                            resolve({ result: result, value: value });
                        }
                    }).show();
                });
            }
        };
    });
});
