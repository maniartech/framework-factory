
(function (root, undefined) {
    "use strict";

    function callbacks ($f) {

        var callback = function (meta) {
                return {
                    type: 'callback',
                    meta: meta
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
            type: "callback",
            handler: function handler(Class, key, options) {
                var proto = Class.prototype;
                proto[key] = null;
            }
        });
    }

    FrameworkFactory.plugins.register(callbacks);

})(this);