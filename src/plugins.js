
/**
 * Represents the plugins registry object.
 *
 * @field {Object}hh
 *
 * @memberOf FrameworkFactory
 * @public
 * @version 1.0
 **/
FrameworkFactory.plugins = (function(){

    var plugins = [];

    function Plugins() {};

    Plugins.prototype = {

        /**
         * Registers the new plugin for the framework. Once registered all the frameworks
         * created henceforth will have specified plugin available.
         * @param {Object} The plugin object.
         * @public
         * @version 1.0
         **/
        register: function register(plugin) {
            var name = (plugin.info) ? plugin.info.name : plugin.name;
            if (typeof plugin === 'function' || typeof plugin === 'object') {
                if (name === undefined) {
                    throw new Error("Missing plugin name.");
                }
                plugins.push(plugin);
                return;
            }
            throw new Error('Invalid plugin type.');
        },

        /**
         * Gets the names of all available plugins with FrameworkFactory.
         *
         * @returns {Array} The plugin names array.
         * @public
         * @version 1.0
         **/
        getNames: function getNames() {
            var names = [],
                plugin,
                i, iLen;
            for (i = 0, iLen = plugins.length; i < iLen; i += 1) {
                plugin = plugins[i];
                names.push(plugin.name);
            }
            return names;
        },

        /**
         * Gest the array of all the the registered plugins with FramewrokFactory.
         * @returns {Array} The plugings array.
         * @public
         * @version 1.0
         **/
        toArray: function toArray() {
            return plugins.slice();
        }
    };

    return new Plugins();

})();

