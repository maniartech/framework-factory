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

(function (global, undefined) {
    "use strict";

    function is($f, config) {

        $f.is = {

            //Validation
            func: function func(val) {
                return typeof val === 'function' || val instanceof Function  === true;
            },

            number: function num(val) {
                return typeof val === 'number' || val instanceof Number  === true;
            },

            undef: function undef(val) {
                return val === undefined;
            },

            nullOrUndef: function nullOrUndef(val) {
                return val === undefined || val === null;
            },

            string: function string(val) {
                return typeof val === 'string' || val instanceof String === true;
            },

            date: function date(val) {
                return val instanceof Date === true;
            },

            plainObject: function(val) {
                if (val === undefined || val === null) return false;
                return ((typeof val === 'object') && (val.constructor === Object));
            },

            array: function(val) {
                return val instanceof Array;
            },

            inBrowser: function browser() {
                return window !== undefined && global === window;
            }
        };
    }

    is.info = {
        name: 'is'
    };

    is.toString = function toString() {
        return is.info.name;
    }

    FrameworkFactory.plugins.register(is);

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

            if (config.defaultBaseClass !== undefined) {
                //It is a base class
                if (prop.type === config.defaultBaseClass) {
                    parent = Object;
                }
                else {
                    parent  = parent || $f[config.defaultBaseClass];
                }
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

        if (config.defaultBaseClass !== undefined) {

            $f[config.defaultBaseClass] = Class({
                type: config.defaultBaseClass
            });
        }

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
                return this;
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
                    value,
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
                var options = {};
                return {
                    type            : 'readonly',
                    value           : value,
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
                    proto[privKey] = options.value;
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
            equals: function(o1, o2) {

                var key;
                //True if both objects are same.
                if (o1 === o2) {
                    return true;
                }
                for(key in o1) {

                    //If key exists in o1 but not in o2, return false.
                    if (o2[key] === undefined) {
                        return false;
                    }
                    var v1 = o1[key];
                    var v2 = o2[key];

                    //If values in a given key not matches return false.
                    if (v1 !== v2) {
                        return false;
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

                   var copy, i, iLen, objVal, refIndex,
                       timestamp = new Date() - 0;

                   if (objRefs.indexOf(obj) >= 0) {
                       return objRefs[obj];
                   }
                   else {
                       objRefs.push(obj);
                   }
                   // Handle the 3 simple types, and null or undefined
                   if (null == obj || "object" != typeof obj) return obj;

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

            loadFromJSON: function(o, json, options) {

                options = options || {};
                var setFunctions = options.setFunctions || false;

                for (var key in json) {

                    //Check json object owns the member
                    if (json.hasOwnProperty[key] === false) {
                        continue;
                    }

                    //Check the member exists in object to set.
                    //if (o[key] === undefined) {
                    //    continue;
                    //}

                    //var propMemberType = typeof prop[key];
                    var oMemberType = typeof o[key];
                    var val = json[key];

                    switch (oMemberType) {

                        case 'object': {
                            if (o[key] === null) {
                                o[key] = val;
                            }
                            else if (o[key].constructor.loadFromJSON !== undefined) {
                                o[key].constructor.loadFromJSON(o, key, val);
                            }
                            else if (o[key] instanceof Array) {
                                //Push the val to o[key].
                                //o[key].push.apply(o[key], val);
                                o[key] = val;
                            }
                            else {
                                _framework.Utils.loadFromJSON(o[key], val);
                            }
                            break;
                        }
                        case 'function': {
                            if (o[key].loadFromJSON !== undefined) {
                                o[key].loadFromJSON(o, key, val);
                            }
                            else {
                                o[key] = val;
                            }
                            break;
                        }
                        default: {
                            o[key] = val;
                        }
                    }
                }
            },

            exportToJSON: function exportToJSON(o) {
                var json = {};
                for (key in o) {

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

    FrameworkFactory.plugins.register(utils);


})(this);


(function (global, undefined) {
    "use strict";

    function collections($f, config) {

        $f.collections = {};
        var collections = $f.collections;

        /**
         * A collection class which stores both indexes as well as keys.
         * @class framework.collection.MapList
         * @name framework.collections.MapList.prototype
         **/
        collections.MapList = $f.Class({

            /**
             * Represents total number of items in the list.
             **/
            length          : $f.property({
                get: function() {
                    return this._items.length;
                }
            }),

            /**
             * Key identifier in the item object.
             * @lends framework.collections.MapList
             **/
            keyName         : 'id',

            validator       : undefined,

            itemBeforeAdd   : $f.event(),
            itemAdd         : $f.event(),
            itemBeforeRemove: $f.event(),
            itemRemoved     : $f.event(),
            itemBeforeSet   : $f.event(),
            itemSet         : $f.event(),

            init: function() {
                this._items = [];
                this._keys = [];
                this._map = {};
                if (arguments.length > 0) {
                    this.add.apply(this, arguments);
                }
            },

            /**
             * Add one or more items into the list.
             * @function MapList.add
             * @param Variable number of items to be added to the list.
             **/
            add: function() {

                var items = this._items,
                    keys = this._keys,
                    map = this._map,
                    keyName = this.keyName,
                    item, key;

                if (arguments[0] instanceof Array) {
                    this.add.apply(this, arguments[0]);
                    return;
                }

                for (var i=0, len=arguments.length; i<len; i++) {

                    item = arguments[i];
                    var args = {
                        item: item,
                        process: true
                    };

                    this.trigger('itemBeforeAdd', args);
                    if (args.process === false) {
                        continue;
                    }
                    //check if key available.
                    if (typeof item === 'object' && item[keyName] !== undefined) {

                        key = item[keyName];

                        //TODO:verify this code
                        if (typeof key === 'function') {
                            key = key();
                        }
                        //key identified, map it.
                        if (key !== undefined) {

                            //Check  if key already exists.
                            if (map[key] !== undefined) {
                                throw new Error('Item with this key [' + key + '] already exists.');
                            }
                            keys.push(key);
                            map[key] = item;
                        }
                    }

                    //Add item to an array.
                    items.push(item);

                    this.trigger('itemAdd', {
                        item: item
                    });

                }
                return this;
            },

            /**
             * Appends a list or an array to the current list.
             **/
            addList: function() {
                var item = arguments[0];

                if (item instanceof Array) {
                    this.add.apply(this, item);
                }
                var items = [];
                for (var i=0, len = arguments.length; i<len; i++) {
                    items.push(item[i].get(i));
                }
                this.add.apply(this, items);
            },

            get: function(indexOrKey){
                if (typeof indexOrKey === 'number') {
                    return this._items[indexOrKey];
                }
                return this._map[indexOrKey];
            },

            replace: function(indexOrKey, item) {
                var index, key, indexKey;
                indexKey = this.findIndexKey(indexOrKey);
                index = indexKey[0];
                key = indexKey [1];
                if (index != -1) {
                    this._items[index] = item;
                }
                if (key !== undefined) {
                    this.map[key] = item;
                }
            },

            findIndexKey: function(indexOrKey) {
                var index, key;
                if (typeof indexOrKey === 'number') {
                    index = indexOrKey;
                    key = this._keys[index];
                }
                else {
                    index = this._keys.indexOf(indexOrKey);
                    key = indexOrKey;
                }
                if (index < 0 || index >= this.length) {
                    throw new Error('Index [' + index.toString() + '] out of range.');
                }
                return [index, key];
            },

            findIndexKeyByItem: function(item) {
                var index = this._items.indexOf(item);
                return findIndexKey(index);
            },

            remove: function(indexOrKey) {

                var indexKey = this.findIndexKey(indexOrKey),
                    index = indexKey[0],
                    key = indexKey [1];

                //If index found
                if (index < 0) {
                    this._items.splice(index, 1); //delete array item
                    this._keys.splice(index, 1); //delete key item
                }

                //Key found
                if (key !== undefined) {
                    delete this._map[key]; //delete key mapping
                }

                return this;
            },

            findKeyOrIndex: function(indexOrKey) {
                if (typeof indexOrKey === 'number'){
                    return this.keys[this.keyName];
                }
                return this._keys.indexOf(indexOrKey);
            },

            clear: function() {
                this._items = [];
                this._keys = [];
                this._map = {};
            },

            indexOf: function(item) {
                return this._items.indexOf(item);
            },

            toArray: function(){
                return this._items;
            },

            each: function(callback, context) {
                var items, i, len;
                items = this._items;
                if (context === undefined) {
                    context = this;
                }
                
                for(i=0, len = items.length; i<len; i++){
                    callback.call(context, items[i]);
                }
                return this;
            }

        });

        /**
         * Sets the value into collection
         **/
        collections.MapList.loadFromJSON = function set(o, key, value) {
            var colObj = o[key];
            if (colObj instanceof collections.MapList === false) {
                throw new Error('Operation "set" not supported on this object.');
            }
            //Clear the collection
            colObj.clear();
            if (value instanceof Array || value instanceof collections.MapList) {
                colObj.add.apply(colObj, value);
            }
            else {
                if (value.$type !== undefined) {
                }
                colObj.add(value);
            }
        };

        collections.MapList.exportToJSON = function toJson(colObj) {
            var items = [];
            var colItems = colObj.toArray();
            for (var i=0, len=colObj.length; i<len; i++) {
                var item = colItems[i];
                items.push($f.utils.toJson(item));
            }
            return items;
        };

        collections.ObservableMapList = $f.Class({

            itemBeforeAdd   : $f.event(),
            itemAdded       : $f.event(),
            itemBeforeRemove: $f.event(),
            itemRemoved     : $f.event(),
            itemBeforeSet   : $f.event(),
            itemSet         : $f.event(),

            init: function() {
                this._list = new collections.MapList();
                _list.add.apply(_list, arguments);
            },

            add: function() {

            }



        }, collections.MapList);

    }

    collections.info = {
        name: 'collections'
    };

    collections.toString = function toString() {
        return collections.info.name;
    };

    FrameworkFactory.plugins.register(collections);


})(this);



    //$f.Register = _framework.Class({
    //
    //    init: function() {
    //        this._register = new collections.MapList();
    //    },
    //
    //    register: function (type, handler) {
    //
    //    },
    //
    //    unregister: function (type) {
    //        var register = this._register;
    //        delete register[type];
    //    },
    //
    //    get: function (type) {
    //        var register = this._register;
    //        return register[type];
    //    },
    //
    //    set: function(key, type) {
    //        var register = this._register;
    //        if (register[type] === undefined) {
    //            throw new Error('Key not found.')
    //        }
    //        register[key] = type;
    //    }
    //
    //}, Object);





//    collections.CollectionWithEvent = _framework.Class({
//
//        keyName         : $property('name'),
//
//        //TODO: On prefix to all the events
//        itemBeforeAdd   : _framework.event(),
//        itemAdded       : _framework.event(),
//        itemBeforeRemove: _framework.event(),
//        itemRemoved     : _framework.event(),
//        itemBeforeSet   : _framework.event(),
//        itemSet         : _framework.event(),
//
//        init: function() {
//            this._items = [];
//            this._keys = {};
//
//            if (arguments.length > 0) {
//                this.add.apply(this, arguments);
//            }
//        },
//
//        count: function() {
//            return this._items.length;
//        },
//
//        add: function() {
//
//            //alert(this.init);
//            var items = this._items,
//                keys = this._keys,
//                _keyName = getPrivateKey('keyName'),  keyName = this[privKey];
//
//            for (var i=0, len=arguments.length; i<len; i++) {
//
//                var item = arguments[i];
//
//                this.itemBeforeAdd.fire(this, {
//                    item: item
//                });
//
//                if (typeof item === 'object' && item[keyName] !== undefined){
//                    var key = item[keyName];
//                    if (typeof key === 'function'){
//                        key = key();
//                    }
//                    if (key !== undefined){
//                        this._keys[key] = item;
//                    }
//                }
//
//                var length = items.push(item);
//                this.itemAdded.fire(this, {
//                    item: item,
//                    index: length-1,
//                    length: length
//                });
//            }
//            return this;
//        },
//
//        getItem: function(indexOrKey){
//            if (typeof indexOrKey === 'number'){
//                return this._items[indexOrKey];
//            }
//            else if(typeof indexOrKey === 'string'){
//                return this._keys[indexOrKey];
//            }
//            throw "Invalid index or key";
//        },
//
//        setItem: function(indexOrKey, value){
//
//            //TODO: donot allow is user change the key...
//            var keyName = this.keyName();
//            if (typeof indexOrKey === 'number'){
//                var item = this._items[indexOrKey]; //validate
//                this._items[indexOrKey] = value;
//                if (item[keyName] !== undefined){
//                    var key = item[keyName];
//                    //reset the key in value if changed...
//                    //TODO: check it...
//                    value[keyName] = key;
//                    this._keys[key] = value;
//                    return this;
//                }
//            }
//            else if(typeof indexOrKey === 'string'){
//                var item = this._keys[indexOrKey];
//                if (item !== undefined){
//                    var index = this.indexOf(item);
//                    this._items[index] = value; //validate
//                    this._keys[indexOrKey] = value;
//                    return this;
//                }
//            }
//            throw "Invalid index or key";
//        },
//
//        remove: function(indexOrKey) {
//
//            var index = -1,
//                item, keyName, key;
//
//            if (typeof indexOrKey === 'number'){
//                index = indexOrKey;
//                item = this._items[index];
//            }
//            else if(typeof indexOrKey === 'string'){
//                item = this._keys[item];
//                index = this.indexOf(item);
//            }
//            else {
//                throw "Invalid index or key";
//            }
//
//            this.itemBeforeRemove.fire(this, {
//                index: index,
//                item: item
//            });
//
//            keyName = this.keyName();
//            key = item[keyName];
//            if (key === undefined){
//
//            }
//            this._items.splice(index, 1); //delete array item
//            this.itemRemoved.fire(this, {
//                item: item
//            });
//
//            return this;
//        },
//
//        indexOf: function(item) {
//            return this._items.indexOf(item);
//        },
//
//        items: function(){
//            return this._items;
//        },
//
//        toArray: function(){
//            return this._items;
//        },
//
//        each: function(callback) {
//            var items, i, len;
//
//            items = this._items;
//            for(i=0, len = items.length; i<len; i++){
//                callback(items[i]);
//            }
//            return this;
//        }
//
//    }, _framework.Component);
//
//    var styles = [];
//
//    function attachFinder(arr, keyName) {
//        var foundKey, obj;
//        arr.find = function(key, cache) {
//
//            cache = cache || true;
//
//            if (cache === true) {
//                if (arr._keys === undefined) {
//                    arr._keys = {};
//                }
//                if (arr._keys[key] === undefined) {
//                    for (var i=0; i<arr.length; i++) {
//                        if (arr[i][keyName] === key) {
//                            foundKey = key;
//                            arr._keys[foundKey] = arr[i];
//                            obj = arr[i];
//                            break;
//                        }
//                    }
//                    if (foundKey === undefined) {
//                        throw new Error('key not found.');
//                    }
//                }
//                else {
//                    obj = arr._keys[key];
//                }
//                return obj;
//            }
//            for (var i=0; i<arr.length; i++) {
//                if (arr[i][keyName] === key) {
//                    return arr[i];
//                }
//            }
//            throw new Error('key not found.');
//        };
//    }
//
//
//    styles[0] = new Style({
//        name: 'wow',
//        style: 'red'
//    });
//
//    var wow = style.find('wow');
//    styles[0] = new Style({
//        name: 'great'
//    });

