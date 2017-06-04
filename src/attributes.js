
(function (root, undefined) {
    "use strict";

    function attributes($f) {

        var attribute = function (defaultValue, meta) {
            meta = meta || {};
            meta.default = defaultValue;

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

    FrameworkFactory.plugins.register({
        name: 'attributes',
        load: attributes
    });

})(this);