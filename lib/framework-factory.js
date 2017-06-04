/**
 * ______                                           _     ______         _
 * |  ___|                                         | |    |  ___|       | |
 * | |_ _ __ __ _ _ __ ___   _____      _____  _ __| | __ | |_ __ _  ___| |_ ___  _ __ _   _
 * |  _| '__/ _` | '_ ` _ \ / _ \ \ /\ / / _ \| '__| |/ / |  _/ _` |/ __| __/ _ \| '__| | | |
 * | | | | | (_| | | | | | |  __/\ V  V / (_) | |  |   <  | || (_| | (__| || (_) | |  | |_| |
 * \_| |_|  \__,_|_| |_| |_|\___| \_/\_/ \___/|_|  |_|\_\ \_| \__,_|\___|\__\___/|_|   \__, |
 *                                                                                      __/ |
 *                                                                                     |___/
 *
 * version: 1.1.1
 * Framework Factory - A JavaScript factory framework for developing class libraries,
 * apps and frameworks
 * http://www.framework-factory.com
 *
 *
 * Architect and Lead Developer: Mohamed Aamir Maniar
 * Twitter: @aamironline
 * Facebook: http://www.facebook.com/aamironline
 *
 * http://www.maniartech.com
 * Twitter: @maniartech
 *
 * Copyright (c) 2011-2017 Maniar Technologies Private Limited (India)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 **/
(function (root, undefined) {
"use strict";


var createObject = Object.create ||
(function(undefined) {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    var Temp = function() {};
    return function (prototype, propertiesObject) {
      if(prototype !== Object(prototype) && prototype !== null) {
        throw TypeError('Argument must be an object, or null');
      }
      Temp.prototype = prototype || {};
      if (propertiesObject !== undefined) {
        Object.defineProperties(Temp.prototype, propertiesObject);
      }
      var result = new Temp();
      Temp.prototype = null;
      // to imitate the case of Object.create(null)
      if(prototype === null) {
         result.__proto__ = null;
      }
      return result;
    };
})();


var getPrototypeOf = Object.getPrototypeOf ||
function getPrototypeOf() {
    "use strict";

    if (typeof "test".__proto__ === "object") {
        Object.getPrototypeOf = function (o) {
            return o.__proto__;
        };
    } else {
        Object.getPrototypeOf = function (o) {
            // May break if the constructor has been tampered with
            return o.constructor.prototype;
        };
    }
};

var indexOf = Array.prototype.indexOf ||
function indexOf(obj, start) {
    "use strict";

    for (var i = (start || 0), j = this.length; i < j; i += 1) {
        if (this[i] === obj) {
            return i;
        }
    }
    return -1;
};


var trim = String.trim ||
function trim(s) {
    "use strict";
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};


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
            key, i, iLen;

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
(function (root, undefined) {
    "use strict";

    function is($f, FrameworkFactory) {

        var _is = {

            //Validation
            /**
             * Checks whether given value is a function or not.
             * @function
             * @param {anything} val The val to be checked for function test.
             * @returns {boolean} ``true`` if parameter val is a valid function, else ``false``.
             * @public
             * @version 1.0
             **/
            func: function func(val) {
                return typeof val === 'function' || val instanceof Function  === true;
            },

            /**
             * Checks whether given value is a string or not.
             * @function
             * @param {anything} val The val to be checked for string test.
             * @returns {boolean} ``true`` if parameter val is a valid string, else ``false``.
             * @public
             * @version 1.0
             **/
            string: function string(val) {
                return typeof val === 'string' || val instanceof String === true;
            },

            /**
             * Checks whether given value is a number or not.
             * @function
             * @param {anything} val The val to be checked for number test.
             * @returns {boolean} ``true`` if parameter val is a valid number, else ``false``.
             * @public
             * @version 1.0
             **/
            number: function number(val) {
                return typeof val === 'number' || val instanceof Number  === true;
            },

            /**
             * Checks whether given value is a primitive or not.
             * @function
             * @param {anything} val The val to be checked for primitive test.
             * @returns {boolean} ``true`` if parameter val is a valid primitive, else ``false``.
             * @public
             * @version 1.0
             **/
            primitive: function primitive(val) {
                return _is.string(val) || _is.number(val);
            },

            /**
             * Checks whether specified value is undefined or not.
             * @function undef
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for undefined test.
             * @returns {boolean} ``true`` if parameter val is a valid undefined, else ``false``.
             * @public
             * @version 1.0
             **/
            undef: function undef(val) {
                return val === undefined;
            },

            /**
             * Checks whether specified value is either null or undefined.
             * @function nullOrUndef
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for null and undefined test.
             * @returns {boolean} ``true`` if parameter val is a either null or undefined, else ``false``.
             * @public
             * @version 1.0
             **/
            nullOrUndef: function nullOrUndef(val) {
                return val === undefined || val === null;
            },

            /**
             * Checks whether specified value is date or not.
             * @function date
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for date test.
             * @returns {boolean} ``true`` if parameter val is a valid date, else ``false``.
             * @public
             * @version 1.0
             **/
            date: function date(val) {
                return val instanceof Date === true;
            },

            /**
             * Checks whether specified value is regular expression or not.
             * @function regExp
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for regular expression test.
             * @returns {boolean} ``true`` if parameter val is a valid regular expression, else ``false``.
             * @public
             * @version 1.0
             **/
            regExp: function regExp(val) {
                return val instanceof RegExp === true;
            },

            /**
             * Checks whether specified value is undefined or not.
             * @function undef
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for undefined test.
             * @returns {boolean} ``true`` if parameter val is a valid undefined, else ``false``.
             * @public
             * @version 1.0
             **/
            plainObject: function (val) {
                if (val === undefined || val === null) { return false; }
                return ((typeof val === 'object') && (val.constructor === Object));
            },

            concreteObject: function (val) {
                return (_is.primitive(val) || _is.date(val) || _is.regExp(val) || _is.nullOrUndef(val) || _is.array(val)) === false;
            },

            array: function (val) {
                return val instanceof Array;
            },

            inBrowser: function () {
                return $f.environment.browser;
            }
        };

        _is.name = "is";

        $f.is = _is;

    }

    FrameworkFactory.plugins.register({
        name: 'is',
        load: is
    });


})(this);
(function (root, undefined) {
    "use strict";

    function classes($f) {

        var fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            defaultBaseClass = $f.config('defaultBaseClass'),
            requireNew = $f.config('requireNew', false),
            _createClass;

        /**
         * Define a new class.
         *
         * @function $f.Class(prop, [parent])
         * @param {Object}      prop   [description]
         * @param {[BaseClas}   parent [description]
         *
         * @example
         * $f.Test = $f.Class({
         *
         *     // constructorFn for $f.Test class.
         *     init: (name) {
         *         this.name = name;
         *     },
         *
         *     // Returns currently set name.
         *     getName: function getName() {
         *         return this.name;
         *     }
         *
         * });
         *
         * @returns {Function}  Returns a constructor function.
         *
         * @memberof $f
         * @public
         */
        _createClass = function (prop, parent) {
            var prototype,
                key,
                constructorFn,
                meta = {},
                create = Object.create,
                hasProp = Object.prototype.hasOwnProperty;

            // Setup parent.
            if ($f[defaultBaseClass] !== undefined) {
                parent  = parent || $f[defaultBaseClass];
            }
            else {
                parent = parent || Object;
            }

            // Setup prop
            prop    = prop || {};

            // Setup constructorFn
            if (requireNew) {
                constructorFn = function Object() {
                    if (this instanceof constructorFn === false) {
                        throw new Error('constructorFn used as function.');
                    }
                    //this.constructor = constructorFn;
                    if (this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }
            else {

                constructorFn = function Object () {
                    var inst = null;

                    // constructorFn is called as function,
                    // instanciate it and return instance object.
                    if(this instanceof constructorFn === false) {
                        inst = create(constructorFn.prototype);
                        if (inst.init !== undefined) {
                            inst.init.apply(inst, arguments);
                        }
                        return inst;
                    }
                    //this.constructor = constructorFn;
                    if (this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }

            // Setup Inheritance
            prototype = _extendClass(constructorFn, parent);

            // Attaches the new member to the
            // constructorFn prototype.
            constructorFn.attach = function attach(prop) {
                var item, type, val, processed,
                    key,
                    typeHandler;

                for(key in prop) {
                    if (hasProp.call(prop, key)) {
                        item = prop[key];
                        type = typeof item;
                        val = item;
                        processed = false;

                        if ($f.is.plainObject(item)) {
                            typeHandler = FrameworkFactory.typeHandlers.get(item.type);
                            if (typeHandler !== undefined && typeHandler.handler !== undefined) {
                                typeHandler.handler(constructorFn, key, item);
                                processed = true;
                            }
                        }
                        else if (type === 'function' &&
                                typeof parent.prototype[key] === 'function' &&
                                fnTest.test(item)) {
                            prototype[key] = (function (key, fn) {
                                var parentFn = parent;

                                return function () {
                                    this.base =  parentFn.prototype[key];
                                    var ret = fn.apply(this, arguments);
                                    this.base = undefined;
                                    return ret;
                                }
                            })(key, item);
                            processed = true;
                        }

                        if (!processed) {
                            prototype[key] = val;
                        }
                    }

                    meta[key] = item;
                }

            };

            // Returns the extended class.
            constructorFn.extend = function extend(o) { return _createClass(o, constructorFn); };

            constructorFn.getMemberInfo = function getMemberInfo(member) {
                if (member in metaObj) {
                    return;
                }
            };

            _setupTypeHandlers(constructorFn);

            constructorFn.attach(prop);

            // Setup Meta Framework

            function _gmn(ownMembersOnly) {
                var keys = Object.keys(meta);

                if (!ownMembersOnly && $f.is.func(parent.getMembers)) {
                    return keys.concat(parent.getMembers());
                }
                return keys;
            }

            function _gm (member) {
                var info;
                if (member in meta) {
                    info = meta[member];
                }
                else if($f.is.func(parent.getMemberInfo)) {
                    info = parent.getMemberInfo(member);
                }

                if ($f.is.plainObject(info) && "type" in info) {
                    return info;
                }

                return null;
            }

            /**
             * Returns the detail about registered member in the specified class
             * @function $f.getMemberInfo( member)
             * @param  {string} member The name of the member
             * @returns {any} An object describing member detail.
             **/
            constructorFn.getMember = function (member) { return _gm(member); };

            /**
             * Returns an array of all the registered member keys including members of base class. If ownMemberOnly is
             * passed as true,
             * @function $f.getMembers( ownMembersOnly )
             * @param  {string} ownMembersOnly The name of the member
             * @returns {Array(string)} An array of string having all the registed member keys.
             **/
            constructorFn.getMemberNames = function (ownMembersOnly) { return _gmn(ownMembersOnly); };

            //return
            return constructorFn;

        };

        /**
         * Creates a new class for $f.
         * @function Class(o)
         * @param {object} o The class definition object.
         * @example
         * $f.Test = $f.Class()
         *
         * @public
         * @version 1.0
         **/
        $f.Class = function () { return _createClass.apply(null, arguments) };

        // Extends subClass with superClass
        function _extendClass(subClass, superClass) {

            // Coopy static members from superClass to subClass
            for (var key in superClass) {
                if (Object.prototype.hasOwnProperty.call(superClass, key)) {
                    subClass[key] = superClass[key];
                }
            }

            // Inherit
            subClass.prototype              = createObject(superClass.prototype);
            subClass.prototype.constructor  = subClass;

            return subClass.prototype;
        }

        // Initializes the type handlers for specified class.
        function _setupTypeHandlers(constructorFn) {
            var types = FrameworkFactory.typeHandlers.getTypes(),
                type, typeHandler,
                i, iLen;

            for (i=0, iLen=types.length; i < iLen; i += 1) {
                type = types[i];
                typeHandler = FrameworkFactory.typeHandlers.get(type);
                if (typeHandler.setup) {
                    typeHandler.setup(constructorFn);
                }
            }
        }
    }

    FrameworkFactory.plugins.register({
        name: 'classes',
        load: classes
    });

})(root);


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

(function (root, undefined) {
    "use strict";

    function events($f) {

        $f.event = function (config) {
            return {
                type: 'event',
                config: config
            };
        };

        FrameworkFactory.typeHandlers.register({
            type: "event",
            setup: function(Class) {
                var proto = Class.prototype,
                    subscribedEventKeys = {},
                    subscribedEvents = [];

                /**
                 * Registers the event handler for one or more plugin.
                 * This function is similar to obj.eventName except it accepts more then one plugin.
                 * @example
                 * var btn = new Button();
                 * btn.on('mousemove mouseout mouseup', function() {});
                 **/
                proto.on = function on (eventNames, eventHandler) {
                    //Conver the event names to lower case.
                    var names = eventNames.toLowerCase().split(' '),
                        i, iLen, eventName,
                        privKey;

                    if (!$f.is.func(eventHandler)) {
                        throw new Error('Invalid handler!');
                    }

                    for (i = 0, iLen = names.length; i < iLen; i += 1) {
                        eventName = trim(names[i]);

                        privKey = '_' + eventName;
                        if (this[privKey] === undefined) {
                            this[privKey] = [];
                        }
                        this[privKey].push(eventHandler);

                        if (subscribedEventKeys[eventName] === undefined) {
                            subscribedEvents.push(eventName);
                            subscribedEventKeys[eventName] = true;
                        }
                    }
                    return this;
                };

                /**
                 * Triggers an event causes all the hander associated with the event
                 * to be invoked.
                 * @param evantName The name of the event to be triggered.
                 * @param args arguments to be supplied to event handler. The args must be
                 * derived from an Object. This is an optional parameter if it is not supplied
                 * it will be created having a field 'eventName' which will help identify
                 * the name of the event which triggered.
                 **/
                proto.trigger = function trigger (eventName, args) {

                    var subscribers = this['_' + eventName.toLowerCase()],
                            callback,
                            i;
                    if (subscribers === undefined || subscribers.length === 0) {
                        return this; //No need to fire event, sicne there is no subscriber.
                    }
                    args = args || {};
                    args.eventName = eventName;
                    for (i = 0; i < subscribers.length; i += 1) {
                        callback = subscribers[i];
                        if (callback.call(this, args) === false) {
                            //no more firing, if handler returns false.
                            break;
                        }
                    }
                    return this;
                };

                /**
                 * Disassociate the handler from the trigger.
                 **/
                proto.off = function off(eventName, handler) {
                    var subscribers = this['_' + eventName.toLowerCase()],
                        index;

                    //Specified event not registered so no need to put it off.
                    if (subscribers === undefined) {
                        return;
                    }

                    //If handler is not provided, remove all subscribers
                    if (handler === undefined) {
                        subscribers.length = 0;
                        return this;
                    }

                    index = subscribers.indexOf(handler);
                    if (index !== -1) {
                        subscribers.splice(index, 1);
                        //TODO: Update subscribedEvents and subscribedEventKeys
                    }
                    return this;
                };

                /**
                 * Unsubscribe all the events from all the subscribers. Use this method to clean up
                 * or detatch event handlers from the object.
                 *
                 * @function $f.Class.unsubscribeAll()
                 * @return {Object} The current object.
                 *
                 * @public
                 **/
                proto.unsubscribeAll = function unsubscribeAll() {
                    var events = subscribedEvents,
                        i, iLen = events.length;

                    for(i=0; i < iLen; i += 1) {
                        this.off(events[i]);
                    }
                    return this;
                };

                /**
                 *
                 */
                proto.subscribers = function subscribers(eventName) {
                    var eventSubscribers = this['_' + eventName.toLowerCase()];
                    return (eventSubscribers) ? eventSubscribers.slice() : [];
                };
            },

            handler: function handler(Class, key) {

                var proto = Class.prototype;

                /**
                 * Registers the event for particular event.
                 * @function
                 * @param {function} handler The handler function which should be invoked on event.
                 * @returns The current object.
                 * @example=
                 * var btn = new Button();
                 * btn.mouseMove(function(){
                 *     console.log('mouse is moving');
                 * });
                 **/
                proto[key] = function (eventHandler) {
                    this.on(key, eventHandler);
                    return this;
                };

                proto[key].event = true;
            }
        });

    }

    FrameworkFactory.plugins.register({
        name: 'events',
        load: events
    });

})(this);


(function (root, undefined) {
    "use strict";

    function callbacks ($f) {

        var callback = function (meta) {
                return {
                    type: 'callback',
                    meta: meta
                };
            };

        /**
         * Helper function to create a callback member for class.
         * @function
         * @param [meta] Additional meta parameter for callback.
         * @public
         * @version 1.0.0
         **/
        $f.callback = callback;

        FrameworkFactory.typeHandlers.register({
            type: "callback",
            handler: function handler(Class, key, options) {
                var proto = Class.prototype;
                proto[key] = null;
            }
        });
    }

    FrameworkFactory.plugins.register({
        name: 'callbacks',
        load: callbacks
    });

})(this);

(function (root, undefined) {
    "use strict";

    function properties($f) {

        var readonly, property, handler;

        /**
         * Attaches the property to the given object. If setter is not specified creates reaonly property.
         * @param {Object} obj The object on which property has to be attached.
         * @param {string} key The key or name of the property.
         * @param {function} getter The getter function, this function will be called whenever get
         *        operation is required.
         * @param {function} setter The setter function, this function will be called whenever set
         *        operation is required. If this setter is missing, it will make the property readonly.
         *        And will throw an errror whenever property is set.
         * @public
         * @version 1.0
         **/
        function attachProperty(obj, key, getter, setter) {

            setter = setter || function () {
                throw new Error('Cannot assign to readonly property "' + key + '".');
            };

            if (Object.defineProperty) {
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    get: getter,
                    set: setter
                });
            }
            else if (obj.__defineGetter__ !== undefined) {
                obj.__defineGetter__(key, getter);
                obj.__defineSetter__(key, setter);
            }
            else {
                throw new Error("Properties are not supported in current environment.");
            }
        }

        function attachReadonly(obj, key, getter) {
            attachProperty(obj, key, getter);
        }

        /**
         * Attaches readonly member to associated class.
         */
        readonly = function readonly(options, meta) {
            var get, value;
            // TODO: Change value to 'default'

            if ($f.is.plainObject(options)) {
                value = options.value;
                if ($f.is.func(options.get)) {
                    get = options.get;
                }
            }
            else {
                value = options;
            }

            meta = meta || {};
            meta.default = value;

            return {
                type            : 'readonly',
                value           : value,
                readonly        : true,
                get             : get,
                set             : undefined,
                meta            : meta
            };
        };

        /**
         * While defining class, this function sets the member as
         * a property.
         * @param: defaultValue, the default value of property
         * @param: firePropertyChanged, if true,
         * @function
         * @public
         * @version 1.0.0
         **/
        property = function property(options, meta) {

            var valueOf,
                value,
                get, set;

            if ($f.is.plainObject(options)) {
                value = options.value;
                get = options.get;
                set = options.set;

                //If get is provided but not set, return readonly version.
                if (get && !set) {
                    return readonly(options);
                }
            }
            else {
                value = options;
            }

            meta = meta || {};
            meta.default = value;

            return {
                type        : 'property',
                readonly    : false,
                value       : value,
                get         : get,
                set         : set,
                meta        : meta
            };
        };

        handler = function (Class, key, options) {

            var proto       = Class.prototype, _get, _set,
                readonly    = options.readonly,
                getter      = options.get,
                setter      = options.set,
                privateKey     = '_' + key,
                value       = options.value;

            if (readonly) {
                if (getter !== undefined) {
                    _get = getter;
                }
                else {
                    _get = function () {
                        return this[privateKey];
                    };
                }
            }
            else {

                _get = getter || function () {
                    return this[privateKey];
                };

                _set = setter || function (v) {
                    this[privateKey] = v;
                };

            }

            if (value !== undefined) {
                proto[privateKey] = value;
            }

            attachProperty(proto, key, _get, _set);
        };

        $f.attachProperty = attachProperty;
        $f.attachReadonly = attachReadonly;
        $f.property     = property;
        $f.readonly     = readonly;

        FrameworkFactory.typeHandlers.register({
            type: "property",
            handler: handler
        });

        FrameworkFactory.typeHandlers.register({
            type: "readonly",
            handler: handler
        });
    }

    FrameworkFactory.plugins.register({
        name: "properties",
        load: properties
    });

})(this);


// CommonJS (Node)
if (typeof module !== "undefined" && typeof module.exports === "object") {
    module.exports = FrameworkFactory;
}
// AMD (RequireJS)
else if (typeof define !== "undefined" && typeof define.amd === "object") {
    define(function() {
        return FrameworkFactory;
    });
}
else {
    root.FrameworkFactory = FrameworkFactory;
}

return FrameworkFactory;

})(this);