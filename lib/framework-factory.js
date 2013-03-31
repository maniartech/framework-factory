/**
 * framework-factory
 * http://framework-factory.com/
 *
 * Copyright (c) 2013 Maniar Technologies Private Limited
 * Author Mohamed Aamir Maniar
 * Licensed under the MIT license.
 * https://framework-factory.com/LICENSE-MIT
 *
 **/


Object.create = Object.create ||
function create(o) {
    "use strict";

    function F() {}
    F.prototype = o;
    return new F();
};


Object.getPrototypeOf = Object.getPrototypeOf ||
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

Array.prototype.indexOf = Array.prototype.indexOf ||
function indexOf(obj, start) {
    "use strict";

    for (var i = (start || 0), j = this.length; i < j; i += 1) {
        if (this[i] === obj) {
            return i;
        }
    }
    return -1;
};


String.trim = String.trim ||
function trim(s) {
    "use strict";
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

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

(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function plugin($f) {

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

            nullOrUndef: function nullOrUndef(val) {
                return val === undefined || val === null;
            },

            date: function date(val) {
                return val instanceof Date === true;
            },

            plainObject: function (val) {
                if (val === undefined || val === null) { return false; }
                return ((typeof val === 'object') && (val.constructor === Object));
            },

            concreteObject: function (val) {
                return (_is.primitive(val) || _is.date(val) || _is.nullOrUndef(val) || _is.array(val)) === false;
            },

            array: function (val) {
                return val instanceof Array;
            },

            inBrowser: function browser() {
                return window !== undefined && root === window;
            }
        };

        $f.is = _is;
    }

    plugin.info = {
        name: 'is'
    };

    plugin.toString = function toString() {
        return plugin.info.name;
    };

    FrameworkFactory.plugins.register(plugin);

})(this);
this.counter = 0;
(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function _plainObject (val) {
        if (val === undefined || val === null) { return false; }
        return ((typeof val === 'object') && (val.constructor === Object));
    }

    function _copyKeys(o, newO, overrideExisting) {
        var key, val;

        overrideExisting = (overrideExisting === undefined) ? true : overrideExisting;

        for(key in o) {
            if (o.hasOwnProperty(key)) {
                val = o[key];
                if (overrideExisting) {
                    newO[key] = val;
                }
                else {
                    if(key in newO === false) {
                        newO[key] = val;
                    }
                }
            }
        }
    }

    function _updateMeta(Class) {
        var meta = Class.__meta__,
            parentMeta = {};

        if(Class.__super__.constructor.__meta__) {
            _copyKeys(Class.__super__.constructor.__meta__, parentMeta);
        }

        _copyKeys(parentMeta, meta, false);
    }

    function plugin($f) {

        var initializing = true,
            fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            defaultBaseClass = $f.config('defaultBaseClass'),
            requireNew = $f.config('requireNew', false),
            Class;

        Class = function (prop, parent) {
            var hasProp = Object.prototype.hasOwnProperty,
                proto, key, Class, __super__, funcString,
                customParent = false;

            if ($f[defaultBaseClass] !== undefined) {
                parent  = parent || $f[defaultBaseClass];
                customParent = true;
            }
            else {
                parent = parent || Object;
            }
            prop    = prop || {};

            //prevents call to
            initializing = true;
            proto = new parent;
            //proto = Object.create(parent.prototype)
            initializing = false;

            Class = function Object() {
                if (requireNew && this instanceof Class === false) {
                    throw new Error('Class used as function.');
                }
                else if(requireNew === false && this instanceof Class === false) {
                    var inst = Object.create(proto);
                    if (initializing === false && inst.init !== undefined) {
                        inst.init.apply(inst, arguments);
                    }
                    return inst;
                }
                //this.constructor = Class;
                if (initializing === false && this.init !== undefined) {
                    this.init.apply(this, arguments);
                }
            };

            //for each static members in parents, copy'em to child
            for (key in parent) {
                //if parent owns the key, set child item = parent item
                if (hasProp.call(parent, key)) {
                    Class[key] = parent[key];
                }
            }

            __super__ = parent.prototype;

            Class.prototype = proto;
            Class.prototype.constructor = Class;
            Class.__super__ = __super__;

            Class.attach = function attach(prop) {

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
                            if (typeHandler !== undefined) {
                                typeHandler(Class, key, item);
                                processed = true;
                            }
                        }
                        //Checks if base exists in overriden function, inspired by John Resig's class
                        //implementation.
                        else if (type === 'function' &&
                                typeof __super__[key] === 'function' &&
                                fnTest.test(item)) {
                            proto[key] = (function (key, fn) {
                                return function () {
                                    this.base =  function () {
                                        __super__[key].apply(this, arguments);
                                    };
                                    var ret = fn.apply(this, arguments);
                                    delete this.base;
                                    return ret;
                                };
                            })(key, item);
                            processed = true;
                        }

                        if (!processed) {
                            proto[key] = val;
                        }
                        Class.__meta__[key] = item;
                    }
                }
                counter += 1;
                _updateMeta(Class);
            };

            Class.__meta__ = {};

            Class.attach(prop);

            //return
            return Class;

        };

        $f.Class = Class;

    }

    plugin.toString = function() {
        return plugin.info.name;
    };

    plugin.info = {
        name: "classes"
    };

    FrameworkFactory.plugins.register(plugin);

})(this);

(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function plugin($f) {

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
                var proto = Class.prototype;
                proto[key] = options.defaultValue;
            };

        $f.attribute = attribute;

        /**
         * Shortcut to framework.attribute method.
         * @see Framework#attribute
         **/
        $f.attr = attribute;
        FrameworkFactory.typeHandlers.register("attribute", attributeHandler);

    }

    plugin.info = {
        name: 'attributes'
    };

    plugin.toString = function () {
        return plugin.info.name;
    };

    FrameworkFactory.plugins.register(plugin);

})(this);

(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function plugin($f) {

        $f.event = function () {
            return {
                type: 'event'
            };
        };

        var eventHandler = function (Class, key) {

            var proto = Class.prototype;

            /**
             * Registers the event for particular event.
             * @function
             * @param {function} handler The handler function which should be invoked on event.
             * @returns The current object.
             * @example
             * var btn = new Button();
             * btn.mouseMove(function(){
             *     console.log('mouse is moving');
             * });
             **/
            proto[key] = function (handler) {
                this.on(key, handler);
                return this;
            };

            proto[key].importObject = function (o, k, v) {
                o[k].call(o, v);
            };


            if (proto.on === undefined) {

                /**
                 * Registers the event handler for one or more plugin.
                 * This function is similar to obj.eventName except it accepts more then one plugin.
                 * @example
                 * var btn = new Button();
                 * btn.on('mousemove mouseout mouseup', function() {});
                 **/
                proto.on = function (eventNames, eventHandler) {
                    var names = eventNames.split(' '),
                        i, iLen, eventName,
                        privKey;

                    if (!$f.is.func(eventHandler)) {
                        throw new Error('Only functions can be registered as event handler');
                    }

                    for (i = 0, iLen = names.length; i < iLen; i += 1) {
                        eventName = String.trim(names[i]);

                        privKey = '_' + eventName;
                        if (this[privKey] === undefined) {
                            this[privKey] = [];
                        }
                        this[privKey].push(eventHandler);

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
                proto.trigger = function (eventName, args) {

                    var s = this['_' + eventName],
                            callback,
                            i;
                    //console.log(eventName, s);
                    if (s === undefined || s.length === 0) {
                        return this; //No need to fire event, sicne there is no subscriber.
                    }
                    args = args || {};
                    args.eventName = eventName;
                    for (i = 0; i < s.length; i += 1) {
                        callback = s[i];
                        if (callback.call(this, args) === false) {
                            //no more firing, if handler returns falses
                            break;
                        }
                    }
                    return this;
                };

                /**
                 * Disassociate the handler from the trigger.
                 **/
                proto.off = function (eventName, handler) {
                    var arr = this['_' + eventName],
                        index;

                    //Specified event not registered so no need to put it off.
                    if (arr === undefined) {
                        return;
                    }

                    index = arr.indexOf(handler);
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                    return this;
                };
            }
        };

        FrameworkFactory.typeHandlers.register("event", eventHandler);
    }

    plugin.info = {
        name: 'events'
    };

    plugin.toString = function () {
        return plugin.info.name;
    };

    FrameworkFactory.plugins.register(plugin);

})(this);


(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function plugin($f) {

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
                throw new Error('You are not allowed to write to readonly property "' + key + '".');
            };

            if (Object.defineProperty) {
                Object.defineProperty(obj, key, {
                    get: getter,
                    set: setter
                });
            }
            else if (obj.__defineGetter__ !== undefined) {
                obj.__defineGetter__(key, getter);
                obj.__defineSetter__(key, setter);
            }
        }

        /**
         * While defining class, this function sets the member as
         * a property.
         * @param: defaultValue, the default value of property
         * @param: firePropertyChanged, if true,
         * @function
         * @public
         * @version 1.0.0
         **/
        var property = function property(options) {

                var valueOf,
                    value,
                    get, set,
                    readonly,
                    observable = true;

                if (typeof options === 'object') {
                    valueOf = options.valueOf();
                    //Incase of Object based primitive plugin like
                    // new String('abc')
                    // new Date('123')
                    if (typeof valueOf !== 'object' && typeof valueOf !== 'function') {
                        //Set primitive
                        value = options.value;
                        get = options.get;
                    }
                    else {
                        //If is object but only getter is found
                        observable  = false;
                        value       = options.value;
                        if (options.get !== undefined && options.set === undefined) {
                            readonly = true;
                            if (arguments[1] === true) {
                                observable = true;
                            }
                        }
                        else if (options.get === undefined && options.set === undefined) {
                            throw new Error('Neither get nor set found in property declaration. This type of object is not currently supported.');
                        }
                        else {
                            get = options.get;
                            set = options.set;
                        }
                    }
                }
                else if (typeof options === 'function') {
                    throw new Error('functions not supported as property default value.');
                }
                else {
                    value = options;
                    if (arguments[1] === true) {
                        observable = true;
                    }
                }

                options = options || {};

                return {
                    type        : 'property',
                    value       : value,
                    readonly    : readonly,
                    observable  : observable || false,
                    get         : options.get,
                    set         : options.set
                };
            },

            /**
             *
             */
            readonly = function readonly(value) {
				var options = {},
                    getter;

				if ($f.is.plainObject(value)) {
					options = value;
					value = (options.value !== undefined) ? options.value : undefined;
					if ($f.is.func(options.get)) {
						getter = options.get;
					}
				}

                return {
                    type            : 'readonly',
                    value           : value,
                    readonly        : true,
                    observable      : false,
                    get             : getter,
                    set             : undefined
                };
            },

            handler = function (Class, key, options) {

                var proto       = Class.prototype, _get, _set,
                    readonly    = options.readonly,
                    observable = options.observable || false,
                    getter      = options.get,
                    setter      = options.set,
                    privKey     = '_' + key,
                    value       = options.value,
                    events = {},
                    changingEvent = key + "changing",
                    changeEvent = key + "change";

                if (getter !== undefined && setter === undefined) {
                    if (value !== undefined) {
                        proto[privKey] = options.value;
                    }
                }
                else {
                    proto[privKey] = options.value;
                }

                //Attach events
                events[changingEvent] = $f.event();
                events[changeEvent] = $f.event();
                Class.attach(events);

                _get = getter || function get() {
                    return this[privKey];
                };

                if (readonly) {
                    _set = function readonlySet() {
                        throw new Error('You are not allowed to write to readonly property "' + key + '".');
                    };
                }
                else {
                    if (setter !== undefined) {
                        if (!observable) {
                            _set = setter;
                        }
                        else {
                            _set = function (v) {
                                var oldVal = this[key],
                                    args;

                                if (oldVal === v) {
                                    return; //property not changed.
                                }

                                args = {
                                    propertyName: key,
                                    oldValue: oldVal,
                                    newValue: v
                                };
                                this.trigger(changingEvent, args);
                                setter.call(this, v);
                                this.trigger(changeEvent, args);
                            };
                        }
                    }
                    else {

                        if (!observable) {
                            _set = function (v) {
                                this[privKey] = v;
                            };
                        }
                        else {
                            _set = function set(v) {
                                var oldVal = this[privKey],
                                    args;

                                if (oldVal === v) {
                                    return; //Property not changed.
                                }
                                args = {
                                    propertyName: key,
                                    oldValue: oldVal,
                                    newValue: v
                                };
                                this.trigger(changingEvent, args);
                                if (this.onPropertyChanging) {
                                    this.onPropertyChanging(args);
                                }
                                this[privKey] = v;
                                this.trigger(changeEvent, args);
                                if (this.onPropertyChanged) {
                                    this.onPropertyChanged(args);
                                }
                            };
                        }
                    }
                }

                if (Object.defineProperty) {
                    Object.defineProperty(proto, key, {
                        get: _get,
                        set: _set
                    });
                }
                else if (proto.__defineGetter__ !== undefined) {
                    proto.__defineGetter__(key, _get);
                    proto.__defineSetter__(key, _set);
                }
            };

        $f.attachProperty = attachProperty;
        $f.property     = property;
        $f.readonly     = readonly;

        FrameworkFactory.typeHandlers.register("property", handler);
        FrameworkFactory.typeHandlers.register("readonly", handler);

    }

    plugin.info = {
        name: 'properties'
    };

    plugin.toString = function toString() {
        return plugin.info.name;
    };

    FrameworkFactory.plugins.register(plugin);

})(this);
