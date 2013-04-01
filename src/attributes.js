
(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function plugin($f) {


        var attribute = function (defaultValue, options) {
                return {
                    type: 'attribute',
                    defaultValue: defaultValue,
                    options: options
                };
            };

        /**
         * Helper function to create attribute members for class.
         * @function
         * @param defaultValue The default value of the attribute.
         * @option [options] Additional options for attribute member.
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
            hanlder: function handler(Class, key, options) {
                var proto = Class.prototype;
                proto[key] = options.defaultValue;
            }
        });

    }

    plugin.info = {
        name: 'attributes'
    };

    plugin.toString = function () {
        return plugin.info.name;
    };

    FrameworkFactory.plugins.register(plugin);

})(this);