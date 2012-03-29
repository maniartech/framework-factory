
(function (global, undefined) {
    "use strict";

    function attributes($f, config) {

        /**
        * Helper function to create attribute members for class.
        * @param defaultValue The default value of the attribute.
        * @option [options] Additional options for attribute member.
        * @public
        * @function
        * @version 1.0.0
        **/
        var attribute = function (defaultValue, options) {
                return {
                    type: 'attribute',
                    defaultValue: defaultValue,
                    options: options
                };
            },

            /**
             * Handles the attribue member while attaching to the class.
             * @inner
             * @function
             * @version 1.0.0
             **/
            attributeHandler = function (Class, key, options) {
                var proto = Class.prototype,
                    privKey = '_' + key;
                proto[key] = options.defaultValue;
            };

        $f.attribute = attribute;

        /**
         * Shortcut to framework.attribute method.
         * @see Framework#attribute
         **/
        $f.attr = attribute;
        $f.typeHandlers.attribute = attributeHandler;

    }

    attributes.info = {
        name: 'attributes'
    };

    attributes.toString = function () {
        return attributes.info.name;
    };

    FrameworkFactory.plugins.register(attributes);

})(this);