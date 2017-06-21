

/**
 * Represents the typeHandlers registry object.
 *
 * @memberOf FrameworkFactory
 * @public
 * @version 1.0
 **/
FrameworkFactory.typeHandlers = (function(){

    var typeHandlers = {};

    function TypeHandlers() {};

    TypeHandlers.prototype = {

        /**
         * Registers the new typeHandler for the framework.
         *
         * @function
         * @param {Object} handler The typeHandler which needs to be registered.
         *
         * @namespace FrameworkFactory.typeHandlers
         * @public
         * @version 1.0
         **/
        register: function register(o) {

            if (typeof o === 'object') {
                typeHandlers[o.typeHandler] = o;
                return;
            }
            throw new Error('Invalid typeHandler.');
        },

        /**
         * Returns the handler function which is used to handle associated types during class creation.
         *
         * @function
         * @param {string} type The type name of typeHandler.
         * @returns {function} The handler function.
         *
         * @namespace FrameworkFactory.typeHandlers
         * @public
         * @version 1.0
         **/
        get: function get(typeHandler) {
            return typeHandlers[typeHandler];
        },

        /**
         * Gets the types of all available typeHandlers with FrameworkFactory.
         *
         * @function
         * @returns {Array} The string array which contains types of all registered type handlers.
         *
         * @namespace FrameworkFactory.typeHandlers
         * @public
         * @version 1.0
         **/
        getTypeHandlers: function getTypeHandlers() {
            var handlers = [],
                typeHandler;
            for (typeHandler in typeHandlers) {
                if (typeHandlers.hasOwnProperty(typeHandler)) {
                    handlers.push(typeHandler);
                }
            }
            return handlers;
        }
    };

    return new TypeHandlers();

})();