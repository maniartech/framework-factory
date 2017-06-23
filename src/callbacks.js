
(function (root, undefined) {
    "use strict";

    function callbacks ($f) {

        var callback = function (tag) {
                return {
                    typeHandler: 'callbacks'
                };
            };

        /**
         * Helper function to create a callback member for class.
         * @function
         * @param [meta] Additional meta parameter for callback.
         * @public
         * @version 1.0.0
         **/
        $f.callback = callback;

        FrameworkFactory.typeHandlers.register({
            typeHandler: "callbacks",
            handler: function handler(Class, key, options) {
                var proto = Class.prototype;
                proto[key] = null;
                options.name = key;
            }
        });
    }

    FrameworkFactory.plugins.register({
        name: 'callbacks',
        load: callbacks
    });

})(this);