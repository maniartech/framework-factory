
(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function plugin($f) {

        var attribute = function (defaultValue, meta) {
                return {
                    type: 'attribute',
                    defaultValue: defaultValue,
                    meta: meta
                };
            };

        /**
         * Helper function to create attribute members for class.
         * @function
         * @param defaultValue The default value of the attribute.
         * @option [meta] Additional meta parameter for attribute member.
         * @public
         * @version 1.0.0
         **/
        $f.attribute = attribute;

        /**
         * Shortcut to framework.attribute method.
         * @see Framework#attribute
         **/
        $f.attr = attribute;

        FrameworkFactory.typeHandlers.register({
            type: "attribute",
            handler: function handler(Class, key, options) {
                var proto = Class.prototype;
                proto[key] = options.defaultValue;
            }
        });

    }

    plugin.info = {
        name: 'attributes'
    };

    FrameworkFactory.plugins.register(plugin);

})(this);