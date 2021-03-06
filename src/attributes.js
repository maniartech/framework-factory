
(function (root, undefined) {
    "use strict";

    function attributes($f) {

        var attribute = function (value, tag) {

            return {
                typeHandler: 'attributes',
                default: value,
                tag: tag
            };
        };

        /**
         * Helper function to create attribute members for class.
         * @function
         * @param value The default value of the attribute.
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
            typeHandler: "attributes",
            handler: function handler(Class, key, options) {
                var proto = Class.prototype;
                proto[key] = options.default;
            }
        });
    }

    FrameworkFactory.plugins.register({
        name: 'attributes',
        load: attributes
    });

})(this);