(function (root, undefined) {
    "use strict";

    var FrameworkFactory,
        plugins = [],
        typeHandlers = {},
        i, iLen,
        environment; //Environement - node, requirejs or browser

    /**
     * FrameworkFactory contains members useful members for generating and managing
     * your very own modern frameworks and framework factory plugins.
     *
     * @Class FrameworkFactory
     * @example
     * var myFramework = FrameworkFactory.create({
     *     name: "myFramework",
     *     version: "1.0"
     * });
     *
     * //Create a new Class called
     * myFramework. = myFramework
     *
     * @public
     * @version 1.0
     **/
    FrameworkFactory = (function () {
        function FrameworkFactory() {}
        return new FrameworkFactory();
    })();

    /**
     * Provides the environment tests in which FrameworkFactory or associated frameworks are
     * currently running. Useful
     * for checking whether current environment is Node, Browser or RequireJS.
     *
     * @field {Object}
     *
     * @public
     * @version 1.0
     */
    FrameworkFactory.environment = environment = (function (){
        function Environement() {}
        return new Environement();
    })();

    /**
     * Returns `true` if framework factory is executing under the NodeJS environment otherwise
     * `false`.
     *
     * @field {boolean}
     *
     * @public
     * @version 1.0
     **/
    environment.node = typeof module !== "undefined" && typeof module.exports === "object";
    if (environment.node) {
        module.exports = FrameworkFactory;
    }

    //environment requirejs
    environment.requirejs = typeof define !== "undefined" && typeof define.amd === "object";
    if (environment.requirejs) {
        define(function() {
            return FrameworkFactory;
        });
    }

    //environment browser
    environment.browser = typeof window !== "undefined" && typeof window.document === "object";

    //Indentify global object
    FrameworkFactory.global = environment.node ? global : root;

    /**
     * The current version of framework factory.
     *
     * @field {string}
     * @defult 1.0.0
     *
     * @public
     * @version 1.0
     **/
    FrameworkFactory.version = '1.0.0';

    /**
     * Factory function which creates the core framework based on specified configuration
     * parameters.
     *
     * @function FrameworkFactory.create(config)
     * @param {objct} config The configuration object.
     * @returns {Object} The base framework.
     *
     * @example
     * //This example creates a new framework called `myFramework` and defines a class called `ClassA`.
     * //`ClassA` contains field called `name` which can be set through constructor `init`.
     *
     * var myFramework = FrameworkFactory.create({
     *     version: '1.2',
     *     framework: 'myFramework'
     * });
     *
     * myFramework.ClassA = myFramework.Class({
     *     name: myFramework.attribute("un-named"),
     *
     *     init: function (name) {
     *         this.name = name;
     *     }
     * });
     *
     * var a = new myFramework.ClassA("wow");
     * console.log(a.name);
     *
     * @memberOf FrameworkFactory
     * @public
     * @version 1.0
     **/
    FrameworkFactory.create = function create(c) {

        var _config = {},
            $f,
            otherVersion = null,
            plugin,
            name,
            key;

        if (typeof c === "string") {
            _config.name = c;
            _config.version = '1.0.0';
            $f = {};
        }
        else {
            c = c || {};

            _config.name = c.name || "framework";
            _config.version = c.version || '1.0.0';

            $f = _config.root || {};

            for (key in c) {
                if (c.hasOwnProperty(key) === true) {
                    if (key in _config === false) {
                        _config[key] = c[key];
                    }
                }
            }
        }

        /**
         * The current version of $f.
         * @field {string} returns
         *
         * @
         */
        $f.version = _config.version;

        //sets the framework name
        $f.name = _config.name;

        //assign the environment object to new framework.
        $f.environment = environment;

        /**
         * Returns the
         * @function config
         **/
        $f.config = function config(key, defaultValue) {
            if (_config[key] !== undefined) {
                return _config[key];
            }
            return defaultValue;
        };

        /**
         * Changes the $f configuration settings.
         * @function $f.config.set(key, value)
         * @param {string} key The name of the configuration key which needs to be changed.
         * @param {object} value The configuration value for specified key.
         * @example         *
         * $f.config.set("myOption", "new-value");
         *
         * @function $f.config.set(o)
         * @param {object} o The configuraiton object
         *
         * @example
         * $f.config.set({
         *     myOption: "new-value"
         * });
         *
         * @public
         */
        $f.config.set = function set() {
            var o = arguments[0],
                key;

            if (arguments.length === 1 && typeof(o) === "object") {
                for(key in o) {
                    if (o.hasOwnProperty(key) === true) {
                        _config[key] = o[key];
                    }
                }
            }
            else if (arguments.length === 2) {
                _config[arguments[0]] = arguments[1];
            }
        };

        //Load plugins
        for (i = 0, iLen = plugins.length; i < iLen; i += 1) {

            plugin = plugins[i];
            name = plugin.info.name;

            //Checks if plugin loaded
            if ($f[name] !== undefined) {
                throw new Error('Plugin with the name "' + name + '" already loaded.');
            }

            //If plugin is defined as function, execute it.
            if (typeof plugin === 'function') {
                plugin($f);
            }
            else if(typeof plugin === 'object') {
                plugin.load($f);
            }
        }

        return $f;
    };

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

                if (typeof plugin === 'function' || typeof plugin === 'object') {
                    if (plugin.info.name === undefined) {
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



    /**
     * Represents the typeHandlers registry object.
     *
     * @memberOf FrameworkFactory
     * @public
     * @version 1.0
     **/
    FrameworkFactory.typeHandlers = (function(){

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
                    typeHandlers[o.type] = o;
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
            get: function get(type) {
                return typeHandlers[type];
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
            getTypes: function getTypes() {
                var types = [],
                    type;
                for (type in typeHandlers) {
                    if (typeHandlers.hasOwnProperty(type)) {
                        types.push(type);
                    }
                }
                return types;
            }
        };

        return new TypeHandlers();

    })();

    root.FrameworkFactory = FrameworkFactory;

})(this);
