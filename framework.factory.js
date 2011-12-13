/**
 * Copyright (C) 2011 - Maniar Technologies Pvt Ltd
 *
 * Desigined By: Mohamed Aamir Maniar
 *
 * */

"use strict";

(function(global, undefined) {

    /*
     * @class A factory class which creates the base framworks for you.
     * */
    var FrameworkFactory = function FrameworkFactory() {};

    /*
    * @field Version of the framework factory.
    *
    * */
    FrameworkFactory.version = '1.0.0';

    /*
    * @function A factory function to create framework root based on spplied options.
    * @param options which help define the behaviour of the framework.
    *
    * */
    FrameworkFactory.create = function create(options) {

        options = options || {};

        var rootNamespace = options.root || 'framework';
        var framework = new FrameworkFactory();

        framework.version = options.version || '1.0.0';
        framework.fullName = options.fullName || 'framework';
        //framework.defaultPropertyType = options.defaultPropertyType || ProertyTypes.STANDARD;

        framework.privateMemberPrefix = options.privateMemberPrifix || '_';

        framework.defaultBaseClass = options.defaultBaseClass || Object;

        return framework;

    };

    var _framework = FrameworkFactory.prototype;

    FrameworkFactory.register = function (memberName, member) {
        if (_framework[memberName] !== undefined) {
            throw new Error ('Member already registered.');
        }
        _framework[memberName] = member;
    };

    global.FrameworkFactory = FrameworkFactory;


    Object.create = Object.create || function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };

    Object.getPrototypeOf = Object.getPrototypeOf || function() {

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


    _framework.Check = {
        isFunction: function(fn) {

        }
    };

    function getPrivateKey (key) {
        return '_' + key;
    }

    //makes console.log more safe.
    var console = global.console || function(){

        function emptyFn() {};
        var functions = 'assert,count,debug,dir,dirxml,error,exception,group,' +
                        'groupCollapsed,groupEnd,info,log,timeStamp,profile,' +
                        'profileEnd,time,timeEnd,trace,warn'.split(',');
        var con = {};
        for(var i=0, len=functions.length; i<len; i++) {
            con[functions[i]] = emptyFn;
        }
    };


    _framework.Class = function (prop, parent) {
        //Checks if _super exists in overriden function, inspired by John Resig.
        var fnTest = /xyz/.test(function (){xyz;}) ? /\$\bsuper\b/ : /.*/,
            hasProp = Object.prototype.hasOwnProperty,
            initializing, proto, key, Class, __super__, framework;

        //console.log(fnTest.toString());

        framework = this;

        parent  = parent || framework.defaultBaseClass;
        prop    = prop || {};

        //prevents call to
        initializing = true;
        proto = new parent;
        initializing = false;

        Class = function Class() {
            if (!(this instanceof Class)) {
                throw Error('Class used as function.');
            }
            //this.constructor = Class;
            if (initializing === false && this["init"] !== undefined) {
                this.init.apply(this, arguments);
            }
        };

        //for each static members in parents, copy'em to child
        for (key in parent) {
            //if parent owns the key, set child item = parent item
            if (hasProp.call(parent, key)) Class[key] = parent[key];
        }

        __super__ = parent.prototype;

        Class.prototype = proto;
        Class.prototype.constructor = Class;
        Class.__super__ = __super__;

        Class.attach = function attach (prop) {

            for(key in prop) {

                if (!hasProp.call(prop, key)) {
                    continue;
                }

                var item = prop[key];
                var type = typeof item;
                //var privKey = "_" + key;

                var val = item;

                //console.log([key, item]);

                var processed = false;

                if (type === 'object' && item.type !== undefined) {

                    var typeHandler = _framework.TypeHandlers.get(item.type);
                    if (typeHandler !== undefined) {
                        typeHandler(Class, key, item);
                        processed = true;
                    }
                }
                else if (type === 'function' &&
                        typeof __super__[key] === 'function' &&
                        fnTest.test(item)) {
                    proto[key] = (function(key, fn){
                        return function() {

                            this.$super =  function() {
                                __super__[key].apply(this, arguments);
                            };
                            var ret = fn.apply(this, arguments);
                            //this._super = tmp;
                            delete this.$super;
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

        if (proto['set'] === undefined) {
            proto.set = function(o) {
                if (typeof o !== 'object') { return; }
                for(var key in o) {
                    if (o.hasOwnProperty(key) === true) {
                        if (this[key] !== undefined) {
                            this[key] = o[key];
                        }
                    }
                }

            };
        }

        Class.__meta__ = {};

        Class.attach(prop);

        //return
        return Class;

    };


    _framework.Register = _framework.Class({

        register: function (type, handler) {
            if (this[type] !== undefined) {
                throw new Error('TypeHandler ' + type + ' already registered.');
            }
            this[type] = handler;
        },

        unregister: function (type) {
            delete this[type];
        },

        get: function (type) {
            return this[type];
        }

    }, Object);

    _framework.TypeHandlers = new _framework.Register();


    global.$event = function() {
        return {
            type: 'framework.event'
        }
    };

    var eventHandler = function(Class, key, options) {

        var proto = Class.prototype;
        var __super__ = Class.__super__;
        var privKey = getPrivateKey(key);
        //var eventName = key;

        var eventFn;

        var eventFn = function eventFn(handler) {

            if (this[privKey] === undefined) {
                this[privKey] = [];
            }
            this[privKey].push(handler);
        };

        proto[key] = eventFn;

        //Handle Prototypes
        if (proto['on'] === undefined) {
            proto.on = function(eventNames, eventHandler) {
                var names = eventNames.split(',');
                for(var i=0, length=names.length; i<length; i++) {
                    var eventName = String.trim(names[i]);
                    if (this[eventName] !== undefined) {
                        //Event found, now register handler
                        this[eventName](eventHandler);
                    }
                }
            };

            proto.trigger = function(eventName, args) {
                var s = this[privKey];
                args = args || {};
                args["eventName"] = eventName;
                for(var i=0, len=s.length; i<len ; i++) {
                    var ret = s[i](this, args);
                    if (ret === false) {
                        //no more firing, if handler returns falses
                        break;
                    }
                }
                return this;
            };

            proto.off = function(eventName, handler) {
                var arr = this[getPrivateKey(eventName)];
                var index = arr.indexOf(handler);
                if (index !== -1) {
                    arr.splice(index, 1);
                }
            };

        }
    };

    _framework.TypeHandlers.register("framework.event", eventHandler);


    global.$field = function(defaultValue, options) {
        return {
            type: 'framework.field',
            defaultValue: defaultValue,
            options: options
        };
    };

    var fieldHandler = function(Class, key, options) {

        var proto = Class.prototype;
        var __super__ = Class.__super__;
        var privKey = getPrivateKey(key);
        var fieldName = key;
        Class.registerMember(key, options);
        proto[fieldName] = options.defaultValue;
    };

    _framework.TypeHandlers.register("framework.field", fieldHandler);



    return FrameworkFactory;

})(this);

//$class = framework.classCreator;
//$interface = framework.interfaceCreator;
//$property = baseObject
