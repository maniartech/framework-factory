/**
 * Copyright (C) 2011 - Maniar Technologies Pvt Ltd
 *
 * Desigined By: Mohamed Aamir Maniar
 *
 * */

"use strict";

(function(global, undefined) {

    /**
     * @class FrameworkFactory
     * A factory class which creates the base framworks for you.
     * */
    var FrameworkFactory = function FrameworkFactory() {};

    /**
     * FrameworkFactory version: 1.0.0
     * @field FrameworkFactory.version
     **/
    FrameworkFactory.version = '1.0.0 alpha';

    /*
    * A factory function to create framework root based on spplied options.
    * @function FrameworkFactory.create
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
    
    var $f = FrameworkFactory.prototype;
    

    /*
     * @function Registeres a new member to the framework factory;
     * */
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

    
    _framework.utils = {
        
        getPrivateKey: function (key) {
            return '_' + key;
        },
        
        getProtectedKey: function(key) {
            return '__' + key;
        },
        
        /**
         * Checks whether both the objects are equals. Iterates through all the
         * members to check equality.
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
         * 
         **/
        clone: function(o, deep) {
            deep = deep || false;
            throw new Error ('Not implemented error.');
        },
        
        set: function(o, props, options) {
            
            options = options || {};
            var setFunctions = options.setFunctions || false;
            
            for (var key in props) {
                
                //Check props object owns the member
                if (props.hasOwnProperty[key] === false) {
                    continue;
                }
                
                //Check the member exists in object to set.
                if (o[key] === undefined) {
                    continue;
                }
                
                //var propMemberType = typeof prop[key];
                var oMemberType = typeof o[key];
                var val = props[key];
                
                switch (oMemberType) {
                    
                    case 'object': {
                        
                        if (o[key].constructor.set !== undefined) {
                            o[key].constructor.set(o[key], props[key]);
                        }
                        else if (o[key] instanceof Array) {                            
                            //Push the val to o[key].
                            o[key].push.apply(o[key], val);
                        }
                        else {
                            _framework.Utils.set(o[key], val);
                        }                        
                        break;
                    }
                    case 'function': {
                        if (setFunctions === true) {
                            o[key] = val;
                        }
                    }
                    default: {
                        o[key] = val;
                    }                        
                }                
            }
        },
        
        //Validation
        isFunction: function(fn) {
            return typeof fn === 'function';
        },
        
        isNumber: function(num) {
            return typeof num === 'number'; 
        },
        
        isUndefined: function(val) {
            return typeof val === 'undefined';
        },
        
        isString: function(str) {
            return typeof val === 'string';
        },
        
        isDate: function(dt) {
            return (typeof dt === 'object') && 
                (dt instanceof Date === true);
        },
        
        //UUID
        
        simpleGuid: function(sep) {
            function section() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (section()+section()+"-"+section()+"-"+section()+"-"+section()+"-"+section()+section()+section());
        }
        
        
        
    };



    $f.Class = function (prop, parent) {
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

                    var typeHandler = _framework.TypeHandlers[item.type];
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

        Class.__meta__ = {};

        Class.attach(prop);

        //return
        return Class;

    };
    
    $f.TypeHandlers = {};


    $f.event = function() {
        return {
            type: 'framework.event'
        }
    };

    var eventHandler = function(Class, key, options) {

        var proto = Class.prototype;
        var __super__ = Class.__super__;
        var privKey = $f.utils.getPrivateKey(key);
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
                var arr = this[$f.utils.getPrivateKey(eventName)];
                var index = arr.indexOf(handler);
                if (index !== -1) {
                    arr.splice(index, 1);
                }
            };

        }
    };

    $f.TypeHandlers["framework.event"] = eventHandler;


    _framework.attribute = function(defaultValue, options) {
        return {
            type: 'framework.attribute',
            defaultValue: defaultValue,
            options: options
        };
    };

    /**
     * Shortcut to framework.attribute method.
     * @see Framework#attribute
     **/
    $f.attr = _framework.attribute;

    var attributeHandler = function(Class, key, options) {

        var proto = Class.prototype;
        var __super__ = Class.__super__;
        var privKey = _framework.utils.getPrivateKey(key);
        proto[key] = options.defaultValue;
    };

    $f.TypeHandlers["framework.attribute"] = attributeHandler;


    
    $f.collections = {};
    var collections = $f.collections;
    
    collections.ObservableList = $f.Class({
        
    }, Object);
    

    /**
     * @class framework.collection.MapList
     * A collection class which stores both indexes as well as keys.
     * @constructor
     * 
     **/
    collections.MapList = $f.Class({

        /**
         * @field Represents total number of items in the list.
         **/
        length          : 0,
        
        /**
         * @field Key identifier in the item object.
         **/
        keyName         : 'id',

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
         * @function add
         * @param Variable number of items to be added to the list.
         **/
        add: function() {

            var items = this._items,
                keys = this._keys,
                map = this._map,
                keyName = this.keyName,
                item, key;

            for (var i=0, len=arguments.length; i<len; i++) {
                item = arguments[i];
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
                            throw new Error('Item with this key already exists.');
                        }
                        
                        keys.push(key);
                        map[key] = item;
                    }
                }
                
                //Add item to an array.                
                this.length = items.push(item);;
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
                throw new Error('Index out of range.');
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

        each: function(callback) {
            var items, i, len;            
            items = this._items;
            for(i=0, len = items.length; i<len; i++){
                callback(items[i]);
            }
            return this;
        }

    }, Object);
    
    /**
     * Sets the value into collection
     **/
    collections.MapList.set = function set(colObj, value) {
        
        if (colObj instanceof collections.MapList === false) {
            throw new Error('Operation "set" not supported on this object.');
        }
        
        //Clear the collection
        colObj.clear();
        if (value instanceof Array || value instanceof collections.MapList) {
            
            colObj.add.apply(colObj, value);
        }
        else {
            colObj.add(value);
        }
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
        }
    }, Object);
    
    
    
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
    
    


    FrameworkFactory.plugin = function(fn) {
        fn.call(global, $f);
    }
    
    return FrameworkFactory;

})(this);

//$class = framework.classCreator;
//$interface = framework.interfaceCreator;
//$property = baseObject
