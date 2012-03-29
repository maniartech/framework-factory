
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
            plugin,
            name,
            plug;

        if (typeof c === "string") {
            _config.rootName = c;
            _config.version = '1.0.0';
        }
        else {
            c = c || {};
            _config.rootName = c.rootName || 'framework';
            _config.version = c.version || '1.0.0';
        }



        framework.version = _config.version;
        framework.name = _config.rootName;
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
