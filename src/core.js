
(function (global, undefined) {
    "use strict";

    var FrameworkFactory = {},

        plugins = [],
        typeHandlers = [],
        i, iLen;

    FrameworkFactory.version = '1.0.0';

    FrameworkFactory.create = function create(c) {

        var _config = {},
            framework = {},
            otherVersion = null,
            plugin,
            name,
            plug,
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
            _config.noConflict = (c.noConflict !== undefined === true)? c.noConflict: false;

            for (key in c) {
                if (c.hasOwnProperty(key) === true) {
                    if (key in _config === false) {
                        _config[key] = c[key];
                    }
                }
            }
        }

        if (_config.noConflict === true) {
            if (_config.framework === undefined) {
                throw new Error('noConfig functionality is only supported if framework name is supplied.');
            }
            otherVersion = global[_config.framework];
            if (otherVersion === undefined || (otherVersion.version === _config.version)) {
                framework.noConflict = function noConflict() {
                    return framework;
                }
            }
            else {
                framework.noConflict = function noConflict() {
                    return otherVersion;
                }
            }
        }

        framework.version = _config.version;
        framework.framework = _config.framework;
        framework.typeHandlers = {};

        framework.config = function config(cfg) {
            return _config[cfg];
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
                plugin(framework, _config);
                plugin.initialized = true;
            }
        }

        return framework;
    };

    FrameworkFactory.plugins = {};

    FrameworkFactory.plugins.register = function register(p) {

        if (typeof p === 'function' || typeof p === 'object') {
            plugins.push(p);
            return;
        }
        throw new Error('Invalid plugin type.');
    };

    FrameworkFactory.plugins.getNames = function getNames() {
        var names = [],
            i, iLen;
        for (i = 0, iLen = plugins.length; i < iLen; i += 1) {
            names.push(plugins[i].info.name);
        }
        return names;
    };

    FrameworkFactory.plugins.getAll = function getAll() {
        var plugs = [],
            i, iLen;

        for (i = 0, iLen = plugins.length; i < iLen; i += 1) {
            plugs.push(plugins[i]);
        }
        return plugs;
    };

    global.FrameworkFactory = FrameworkFactory;

})(this);
