
var FrameworkFactory;

(function (root, undefined) {
    "use strict";

    /**
     * FrameworkFactory is a main object in framework-factory. It contains members
     * useful for generating and managing your very own modern frameworks
     * and framework factory plugins.
     *
     * @object FrameworkFactory
     *
     * @example
     * var myFramework = FrameworkFactory.create({
     *     name: "myFramework",
     *     version: "1.0"
     * });
     *
     * //Creates a new Class called Base
     * myFramework.Base = myFramework.Class();
     *
     * @public
     * @version 1.0
     **/
    FrameworkFactory = (function () {
        return new (function FrameworkFactory() {});
    })();

    /**
     * The current version of framework factory.
     *
     * @field {string}
     * @defult 1.0.0
     *
     * @public
     * @version 1.0
     **/
    FrameworkFactory.version = '1.1.0';

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
    function _c(c) {

        var _config = {},
            $f,
            otherVersion = null,
            plugins = FrameworkFactory.plugins.toArray(),
            plugin,
            name,
            key;

        // Create Framework


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

        // Update Configuration

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
        $f.environment = FrameworkFactory.environment;

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
            name = (plugin.info) ? plugin.info.name : plugin.name;



            //Checks if plugin loaded
            if ($f[name] !== undefined) {
                throw new Error('Plugin with the name "' + name + '" already loaded.');
            }

            //If plugin is defined as function, execute it.
            if (typeof plugin === 'function') {
                plugin($f);
            }
            else if(typeof plugin === 'object') {
                plugin.load($f, FrameworkFactory);
            }
        }

        return $f;
    };

    FrameworkFactory.create = function create(c) { return _c(c); }

})(this);
