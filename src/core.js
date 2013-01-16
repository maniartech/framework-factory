
(function (global, undefined) {
    "use strict";

    var FrameworkFactory = {},

        plugins = [],
        i, iLen;

    /**
     * The current version of framework factory.
     * @field
     * @public
     * @version 1.0
     **/
    FrameworkFactory.version = '1.0.0';

    /**
     * Factory function which creates the core framework based on specified configuration
     * parameters.
     * @function
     * @param {objct} config The configuration object.
     * @returns {Object} The base framework.
     * @example
     *      var framework = FrameworkFactory.create({
     *          version: '1.2',
     *          framework: 'xyzjs'
     *      });
     * @public
     * @version 1.0
     **/
    FrameworkFactory.create = function create(c) {

        var _config = {},
            framework = {},
            otherVersion = null,
            plugin,
            name,
            key;

        if (typeof c === "string") {
            _config.framework = c;
            _config.version = '1.0.0';
            _config.noConflict = false;
        }
        else {
            c = c || {};

            _config.framework = c.framework;
            _config.version = c.version || '1.0.0';
            _config.noConflict = (c.noConflict !== undefined) ? c.noConflict : false;

            for (key in c) {
                if (c.hasOwnProperty(key) === true) {
                    if (key in _config === false) {
                        _config[key] = c[key];
                    }
                }
            }
        }

        //If noConflict config is true and framework detected in global,
        //resets the global with current version and framework.noConflict()
        //function returns the other version.
        if (_config.noConflict === true) {
            if (_config.framework === undefined) {
                throw new Error('noConfig functionality is only supported if framework name is supplied.');
            }
            //Other version detected.
            otherVersion = global[_config.framework];
            if (otherVersion === undefined || (otherVersion.version === _config.version)) {
                framework.noConflict = function noConflict() {
                    return framework;
                };
            }
            else {
                framework.noConflict = function noConflict() {
                    return otherVersion;
                };
            }
        }

        //sets the framework version
        framework.version = _config.version;

        //sets the framework name
        framework.framework = _config.framework;

        //initialize empty type handlers
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
     * @field {Object}
     * @public
     * @version 1.0
     **/
    FrameworkFactory.plugins = {};

    /**
     * Registers the new plugin for the framework. Once registered all the frameworks
     * created henceforth will have specified plugin available.
     * @param {Object} The plugin object.
     * @public
     * @version 1.0
     **/
    FrameworkFactory.plugins.register = function register(p) {

        if (typeof p === 'function' || typeof p === 'object') {
            plugins.push(p);
            return;
        }
        throw new Error('Invalid plugin type.');
    };

    /**
     * Gets the names of all available plugins with FrameworkFactory.
     * @returns {Array} The plugin names array.
     * @public
     * @version 1.0
     **/
    FrameworkFactory.plugins.getNames = function getNames() {
        var names = [],
            i, iLen;
        for (i = 0, iLen = plugins.length; i < iLen; i += 1) {
            names.push(plugins[i].info.name);
        }
        return names;
    };

    /**
     * Gest the array of all the the registered plugins with FramewrokFactory.
     * @returns {Array} The plugings array.
     * @public
     * @version 1.0
     **/
    FrameworkFactory.plugins.toArray = function toArray() {
        return plugins.slice();
    };

    global.FrameworkFactory = FrameworkFactory;

})(this);
