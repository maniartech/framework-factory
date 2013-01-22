/**
 * Copyright (C) 2011 - Maniar Technologies Pvt Ltd
 * Desigined By: Mohamed Aamir Maniar
 *
 * */


Object.create = Object.create || function (o) {
    "use strict";

    function F() {}
    F.prototype = o;
    return new F();
};


Object.getPrototypeOf = Object.getPrototypeOf || function () {
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
function (obj, start) {
    "use strict";

    for (var i = (start || 0), j = this.length; i < j; i += 1) {
        if (this[i] === obj) {
            return i;
        }
    }
    return -1;
};


String.trim = String.trim || function (s) {
    "use strict";
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};


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

(function (global, undefined) {
    "use strict";

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
             * Checks whether given value is a number or not.
             * @function
             * @param {anything} val The val to be checked for number test.
             * @returns {boolean} ``true`` if parameter val is a valid number, else ``false``.
             * @public
             * @version 1.0
             **/
            string: function string(val) {
                return typeof val === 'string' || val instanceof String === true;
            },

            number: function num(val) {
                return typeof val === 'number' || val instanceof Number  === true;
            },

            primitive: function primitive(val) {
                return _is.string(val) || _is.number(val);
            },

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
                return window !== undefined && global === window;
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

    global.FrameworkFactory.plugins.register(plugin);

})(this);

(function (global, undefined) {
    "use strict";

    function plugin($f) {

        var initializing = true,
            fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            defaultBaseClass = $f.config('defaultBaseClass'),
            Class;

        Class = function (prop, parent) {
            //Checks if _super exists in overriden function, inspired by John Resig.
            var hasProp = Object.prototype.hasOwnProperty,
                proto, key, Class, __super__, funcString;

            if ($f[defaultBaseClass] !== undefined) {
                parent  = parent || $f[defaultBaseClass];
            }
            else {
                parent = parent || Object;
            }
            prop    = prop || {};

            //prevents call to
            initializing = true;
            proto = new parent;
            initializing = false;

            //TODO: Validate & execute prop.type
            if (prop.type === undefined || typeof prop.type !== 'string') {
                Class = function Class() {
                    if (!(this instanceof Class)) {
                        throw new Error('Class used as function.');
                    }
                    //this.constructor = Class;
                    if (initializing === false && this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }
            else {
                funcString = "Class = function " + prop.type + "() { \
                    if (!(this instanceof Class)) { \
                        throw new Error('Class used as function.'); \
                    } \
                    if (initializing === false && this.init !== undefined) { \
                        this.init.apply(this, arguments); \
                    } \
                }";
                Class = eval(funcString);
            }

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
                    typeHandler;

                for (key in prop) {
                    if (hasProp.call(prop, key)) {

                        item = prop[key];
                        type = typeof item;
                        val = item;
                        processed = false;

                        if (type === 'object' && item !== null && item.type !== undefined) {
                            typeHandler = $f.typeHandlers[item.type];
                            if (typeHandler !== undefined) {
                                typeHandler(Class, key, item);
                                processed = true;
                            }
                        }
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

                        //console.log([key, type == 'function', typeof __super__[key], fnTest.test(item)]);

                        if (!processed) {
                            proto[key] = val;
                        }
                        Class.__meta__[key] = item;
                    }
                }
            };

            Class.__meta__ = {};

            Class.attach(prop);

            //return
            return Class;

        };

        $f.Class = Class;

    };

    plugin.toString = function() {
        return "plugin";
    }

    plugin.info = {
        name: 'plugin'
    };

    FrameworkFactory.plugins.register(plugin);


})(this);

(function (global, undefined) {
    "use strict";

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
        $f.typeHandlers.attribute = attributeHandler;

    }

    plugin.info = {
        name: 'plugin'
    };

    plugin.toString = function () {
        return plugin.info.name;
    };

    global.FrameworkFactory.plugins.register(plugin);

})(this);

(function (global, undefined) {
    "use strict";


    function plugin($f) {

        $f.event = function () {
            return {
                type: 'event'
            };
        };

        var eventHandler = function (Class, key) {

            var proto = Class.prototype;
            //var eventName = key;


            /**
             * Registers the event for particular event.
             * @example
             * var btn = new Button();
             * btn.mouseMove(function(){
             *  console.log('mouse is moving');
             * });
             **/
            proto[key] = function (handler) {
				var privKey = '_' + key;

				if (!$f.is.func(handler)) {
					throw new Error('Only functions can be registered as event handler');
				}

                if (this[privKey] === undefined) {
                    this[privKey] = [];
                }
                this[privKey].push(handler);
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
                        i, iLen, eventName;
                    for (i = 0, iLen = names.length; i < iLen; i += 1) {
                        eventName = String.trim(names[i]);
                        if (this[eventName] !== undefined) {
                            //Event found, now register handler
                            this[eventName](eventHandler);
                        }
                    }
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
                            i, iLen;
                    //console.log(eventName, s);
                    if (s === undefined || s.length === 0) {
                        return this; //No need to fire event, sicne there is no subscriber.
                    }
                    args = args || {};
                    args.eventName = eventName;
                    for (i = 0, iLen = s.length; i < iLen; i += 1) {
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
                };

            }
        };

        $f.typeHandlers.event = eventHandler;

    }

    plugin.info = {
        name: 'plugin'
    };

    plugin.toString = function () {
        return plugin.info.name;
    };

    global.FrameworkFactory.plugins.register(plugin);

})(this);


(function (global, undefined) {
    "use strict";

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

        $f.typeHandlers.property = handler;
        $f.typeHandlers.readonly = handler;

    }

    plugin.info = {
        name: 'plugin'
    };

    plugin.toString = function toString() {
        return plugin.info.name;
    };

    global.FrameworkFactory.plugins.register(plugin);

})(this);




(function (global, undefined) {
    "use strict";

    function utils($f, config) {

        $f.utils = {

            /**
             * Checks whether both the objects are equals. Iterates through all the
             * members to check equality.
             * @function framework.utils.equals
             * @param o1 The first object
             * @param o2 The second object
             * @returns True if both the objects are equal, false if they are not.
             **/
            equals: function (o1, o2) {

                var key, v1, v2, i, iLen;

                //True if both objects references are same.
                if (o1 === o2) {
                    return true;
                }

                for (key in o1) {
                    //If key exists in o1 but not in o2, return false.
                    if (o2[key] === undefined) {
                        return false;
                    }

                    v1 = o1[key];
                    v2 = o2[key];

                    //Skip functions
                    if ($f.is.func(key)) {
                        continue;
                    }

                    if ($f.is.primitive(v1)) {
                        if (v1 instanceof Object) {
                            if (v1.toString() !== v2.toString()) {
                                return false;
                            }
                        }
                        else {
                            if (v1 !== v2) {
                                return false;
                            }
                        }
                    }
                    else if ($f.is.date(v1)) {
                        if (v1.getTime() !== v2.getTime()) {
                            return false;
                        }
                    }
                    else if ($f.is.array(v1)) {
                        for (i = 0, iLen = v1.length; i < iLen; i += 1) {
                            if ($f.utils.equals(v1[i], v2[i]) === false) {
                                return false;
                            }
                        }
                    }
                    else {
                        if ($f.utils.equals(v1, v2) === false) {
                            return false;
                        }
                    }
                }

                //If key exists in o2 but not in o1, returns false.
                for (key in o2) {
                    if (o1[key] === undefined) {
                        return false;
                    }
                }
                //Return true, becuase no differences found.
                return true;

            },


            /**
            * Returns the cloned object created using deep copy algorithm.
            * @param Object that need to be copied.
            * @returns Deep copied object. *
            * @ref: http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
            * @remark:
            *  - Modified to handle circular dependencies.
            *  - May not behave as expected if object consturctor accepts various parameters.
            **/
            deepCopy: function deepCopy(o) {

                //To improve performance, need to replace array with some sort of
                //hash map that accepts objects as key.
                var objRefs = [];

                function doCopy(obj) {

                    var copy, i, iLen;

                    if (objRefs.indexOf(obj) >= 0) {
                         //Object found, return the same object no need to copy it.
                        return obj;
                    }
                    else {
                        objRefs.push(obj);
                    }
                    // Handle the 3 simple types, and null or undefined
                    if (null === obj || "object" !== typeof obj) {
                        return obj;
                    }

                    // Handle Date
                    if (obj instanceof Date) {
                        copy = new Date();
                        copy.setTime(obj.getTime());
                        return copy;
                    }

                    // Handle Array
                    if (obj instanceof Array) {
                        copy = [];
                        for (i = 0, iLen = obj.length; i < iLen; i += 1) {
                            copy[i] = doCopy(obj[i]);
                        }
                        return copy;
                    }

                    // Handle Object
                    if (obj instanceof Object) {
                        copy = new obj.constructor();
                        for (var attr in obj) {
                            if (obj.hasOwnProperty(attr) === true) {
                                copy[attr] = doCopy(obj[attr]);
                            }
                        }
                        return copy;
                    }
                    throw new Error("Unable to copy obj! Its type isn't supported.");
                }
                return doCopy(o);
            },

            importObject: function (o, json, options) {

                options = options || {};
                var key;

                for (key in json) {

                    //Check json object owns the member
                    if (json.hasOwnProperty[key] === true) {

                        //Check the member exists in object to set.
                        //if (o[key] === undefined) {
                        //    continue;
                        //}

                        //var propMemberType = typeof prop[key];
                        var oMemberType = typeof o[key];
                        var val = json[key];

                        switch (oMemberType) {
                        case 'object':
                            if (o[key] === null) {
                                o[key] = val;
                            }
                            else if (o[key].constructor.importObject !== undefined) {
                                o[key].constructor.importObject(o, key, val);
                            }
                            else if (o[key] instanceof Array) {
                                //Push the val to o[key].
                                //o[key].push.apply(o[key], val);
                                o[key] = val;
                            }
                            else {
                                $f.Utils.importObject(o[key], val);
                            }
                            break;

                        case 'function':
                            if (o[key].importObject !== undefined) {
                                o[key].importObject(o, key, val);
                            }
                            else {
                                o[key] = val;
                            }
                            break;

                        default:
                            o[key] = val;
                        }
                    }
                }
            },

            //UUID
            simpleGuid: function(sep) {
                function section() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                }
                return (section()+section()+"-"+section()+"-"+section()+"-"+section()+"-"+section()+section()+section());
            },

            //Empty
            emptyFn: function(){},

            'undefined': undefined

        };

    }

    utils.info = {
        name: 'utils'
    };

    utils.toString = function toString() {
        return utils.info.name;
    };

    global.FrameworkFactory.plugins.register(utils);


})(this);

