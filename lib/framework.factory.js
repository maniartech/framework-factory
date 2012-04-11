/**
 * Copyright (C) 2011 - Maniar Technologies Pvt Ltd
 * Desigined By: Mohamed Aamir Maniar
 *
 * */


Object.create = Object.create || function (o) {
    function F() {}
    F.prototype = o;
    return new F();
};


Object.getPrototypeOf = Object.getPrototypeOf || function () {

    if (typeof "test".__proto__ === "object" ) {
        Object.getPrototypeOf = function(o){
            return o.__proto__;
        };
    } else {
        Object.getPrototypeOf = function(o){
            // May break if the constructor has been tampered with
            return o.constructor.prototype;
        };
    }
};

Array.prototype.indexOf = Array.prototype.indexOf ||
function (obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i += 1) {
        if (this[i] === obj) {
            return i;
        }
    }
    return -1;
};


String.trim = String.trim || function(s) {
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
};


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
            plug,
            key;

        if (typeof c === "string") {
            _config.framework = c;
            _config.version = '1.0.0';
        }
        else {
            c = c || {};
            _config.framework = c.framework || 'framework';
            _config.version = c.version || '1.0.0';

            for (key in c) {
                if (c.hasOwnProperty(key) === true) {
                    if (key in _config === false) {
                        _config[key] = c.key;
                    }
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


(function (global, undefined) {
    "use strict";

    function classes($f, config) {

        var initializing = true,
            fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            Class;

        Class = function (prop, parent) {
            //Checks if _super exists in overriden function, inspired by John Resig.
            var hasProp = Object.prototype.hasOwnProperty,
                proto, key, Class, __super__, funcString;

            parent  = parent || Object;
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

                    if (!hasProp.call(prop, key)) {
                        continue;
                    }

                    item = prop[key];
                    type = typeof item;
                    val = item;
                    processed = false;

                    if (type === 'object' && item.type !== undefined) {
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
            };

            Class.__meta__ = {};

            Class.attach(prop);

            //return
            return Class;

        };

        $f.Class = Class;

    };

    classes.toString = function() {
        return "classes";
    }

    classes.info = {
        name: 'classes'
    };

    FrameworkFactory.plugins.register(classes);


})(this);

(function (global, undefined) {
    "use strict";

    function attributes($f, config) {

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
                var proto = Class.prototype,
                    privKey = '_' + key;
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

    attributes.info = {
        name: 'attributes'
    };

    attributes.toString = function () {
        return attributes.info.name;
    };

    FrameworkFactory.plugins.register(attributes);

})(this);

(function(global, undefined) {
    "use strict";


    function events($f, config) {

        $f.event = function () {
            return {
                type: 'event'
            };
        };

        var eventHandler = function (Class, key, options) {

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
                if (this[privKey] === undefined) {
                    this[privKey] = [];
                }
                this[privKey].push(handler);
            };

            proto[key].loadFromJSON = function (o, k, v) {
                o[k].call(o, v);
            };


            if (proto.on === undefined) {

                /**
                 * Registers the event handler for one or more events.
                 * This function is similar to obj.eventName except it accepts more then one events.
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
                        index = arr.indexOf(handler);
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                };

            }
        };

        $f.typeHandlers.event = eventHandler;

    }

    events.info = {
        name: 'events'
    };

    events.toString = function () {
        return events.info.name;
    };

    FrameworkFactory.plugins.register(events);

})(this);


(function (global, undefined) {
    "use strict";

    function properties($f, config) {

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
                defaultValue,
                observable,
                get, set,
                readonly;

            if (typeof options === 'object') {
                valueOf = options.valueOf();
                //Incase of Object based primitive properties like
                // new String('abc')
                // new Date('123')
                if (typeof valueOf !== 'object' && typeof valueOf !== 'function') {
                    //Set primitive
                    defaultValue = options.defaultValue;
                    get = options.get;
                }
                else {
                    //If is object but only getter is found
                    observable = false;
                    defaultValue = options.defaultValue;
                    if (options.get !== undefined && options.set === undefined) {
                        readonly = true;
                        if (arguments[1] === true) {
                            observable = true;
                        }
                    }
                    else if(options.get === undefined && options.set === undefined) {
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
                defaultValue = options;
                if (arguments[1] === true) {
                    observable = true;
                }
            }

            options = options || {};

                return {
                    type        : 'property',
                    defaultValue: defaultValue,
                    readonly    : readonly,
                    observable  : observable || false,
                    get         : options.get,
                    set         : options.set
                };
            },

            /**
             *
             */
            readonly = function readonly(defaultValue) {
                var options = {};
                return {
                    type            : 'readonly',
                    defaultValue    : defaultValue,
                    readonly        : true,
                    observable      : false,
                    get             : undefined,
                    set             : undefined
                };
            },

            handler = function (Class, key, options) {

                var proto       = Class.prototype, _get, _set,
                    readonly    = options.readonly,
                    observable = options.observable || false,
                    getter      = options.get,
                    setter      = options.set,
                    privKey     = '_' + key;


                if (!(getter !== undefined && setter === undefined)) {
                    proto[privKey] = options.defaultValue;
                }

                if (proto.propertyChanging === undefined) {

                    Class.attach({
                        propertyChanging: $f.event(),
                        propertyChanged : $f.event(),
                        triggerPropertyChanging: function triggerPropertyChanging(oldValue, newValue) {
                            var args = {
                                propertyName: key,
                                oldValue: oldValue,
                                newValue: newValue
                            };
                            this.trigger('propertyChanging', args);
                        },
                        triggerPropertyChanged: function triggerPropertyChanged(oldValue, newValue) {
                            var args = {
                                propertyName: key,
                                oldValue: oldValue,
                                newValue: newValue
                            };
                            this.trigger('propertyChanged', args);
                        }
                    });
                }

                //console.log('In set', setter);


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
                            this.trigger('propertyChanging', args);
                            setter.call(this, v);
                            this.trigger('propertyChanged', args);
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

                                this.trigger('propertyChanging', args);
                                this[privKey] = v;
                                this.trigger('propertyChanged', args);
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


        $f.property     = property;
        $f.readonly     = readonly;

        $f.typeHandlers.property = handler;
        $f.typeHandlers.readonly = handler;

    }

    properties.info = {
        name: 'properties'
    };

    properties.toString = function toString() {
        return properties.info.name;
    };

    FrameworkFactory.plugins.register(properties);


})(this);


