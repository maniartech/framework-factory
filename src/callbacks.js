
(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function plugin($f) {

        var callback = function (config) {
                return {
                    type: 'callback',
                    config: config
                };
            };

        /**
         * Helper function to create a callback member for class.
         * @function
         * @param [config] Additional configuration options for callback.
         * @public
         * @version 1.0.0
         **/
        $f.callback = callback;

        FrameworkFactory.typeHandlers.register({
            type: "callback",
            handler: function handler(Class, key, options) {
                var proto = Class.prototype;
                proto[key] = false;
            }
        });
    }

    plugin.info = {
        name: 'callbacks'
    };

    FrameworkFactory.plugins.register(plugin);

})(this);