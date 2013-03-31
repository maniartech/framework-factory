(function (root, undefined) {
    "use strict";

    var FrameworkFactory,
        plugins = [],
        typeHandlers = {},
        i, iLen,
        environment, //Environement - node, requirejs or browser
        g; //Global

    /**
     * Represents the FrameworkFactory singleton class object, which contains
     * members useful for generating and managing your framework and framework-factory
     * plugins.
     *
     * @Class FrameworkFactory
     *
     * @public
     * @version 1.0
     **/
    FrameworkFactory = (function (){
        function FrameworkFactory() {}
        return new FrameworkFactory();
    })();

    //Setup environment
    if (module !== undefined && typeof module.exports === "object") {
        environment = "node";
        module.exports = FrameworkFactory;
    }
    else if (define !== undefined && typeof define.amd) {
        environment = "requirejs";
        define(function() {
            return FrameworkFactory;
        });
    }
    else {
        environment = "browser";
        root.FrameworkFactory = FrameworkFactory;
    }

    //Indentify global object
    FrameworkFactory.global = environment === "node" ? global : root;

    /**
     * The current environment in which FrameworkFactory is running.
     * @field {string}
     *
     * @public
     * @version 1.0
     */
    FrameworkFactory.environment = environment;

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
            framework,
            otherVersion = null,
            plugin,
            name,
            key;

        if (typeof c === "string") {
            _config.name = c;
            _config.version = '1.0.0';
            framework = {};
        }
        else {
            c = c || {};

            _config.name = c.name || "framework";
            _config.version = c.version || '1.0.0';

            framework = _config.root || {};

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
        framework.version = _config.version;

        //sets the framework name
        framework.name = _config.name;

        /**
         *
         * @public
         * @version 1.0
         */
        framework.typeHandlers = {};

        /**
         * Returns the
         * @function config
         **/
        framework.config = function config(cfg, defaultValue) {
            if (_config[cfg] !== undefined) {
                return _config[cfg];
            }
            return defaultValue;
        };

        framework.config.set = function set(value) {
            _config[key] = value;
        };

        //Load plugins
        for (i = 0, iLen = plugins.length; i < iLen; i += 1) {

            plugin = plugins[i];
            name = plugin.info.name;

            //Checks if plugin loaded
            if (framework[name] !== undefined) {
                throw new Error('Plugin with the name "' + plugin.name + '" already loaded.');
            }

            //If plugin is defined as function, execute it.
            if (typeof plugin === 'function') {
                plugin(framework);
                plugin.initialized = true;
            }
        }

        return framework;
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
    FrameworkFactory.plugins = {

        /**
         * Registers the new plugin for the framework. Once registered all the frameworks
         * created henceforth will have specified plugin available.
         * @param {Object} The plugin object.
         * @public
         * @version 1.0
         **/
        register: function register(p) {

            if (typeof p === 'function' || typeof p === 'object') {
                plugins.push(p);
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
                i, iLen;
            for (i = 0, iLen = plugins.length; i < iLen; i += 1) {
                names.push(plugins[i].info.name);
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



    /**
     * Represents the typeHandlers registry object.
     *
     * @memberOf FrameworkFactory
     * @public
     * @version 1.0
     **/
    FrameworkFactory.typeHandlers = {

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
        register: function register(type, handler) {

            if (typeof handler === 'function') {
                typeHandlers[type] = handler;
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

    root.FrameworkFactory = FrameworkFactory;

})(this);
