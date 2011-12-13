/**
 * Copyright (C) 2011 - Maniar Technologies Pvt Ltd
 *
 * */

/*
 * Tests:
 * - object.prototype change problem - try with hasOwnProperty
 * - speed with property setter and getter....
 * - cloning
 * - setting multiple properties
 * - Object options
 * - automatic initialization of base object through init
 * - Remove unnecessary stuffs like alias, unnecessary events etc..
 * - Remove property creation from constructor
 *
 * */
"use strict"

if ( typeof Object.getPrototypeOf !== "function" ) {
    if ( typeof "test".__proto__ === "object" ) {
        Object.getPrototypeOf = function(o){
            return o.__proto__;
        };
    } else {
        Object.getPrototypeOf = function(o){
            // May break if the constructor has been tampered with
            return o.constructor.prototype;
        };
    }
}

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

Object.dump = function(o) {
    console.log(str);
    for (var key in o) {
        var item = o[key];
        if (typeof item != 'function'){
            console.log(key + ":"  + o[key]);
        }
    }
};


Object.clone = function(o){
    if (null == o || "object" != typeof o) return o;
    var obj = o.constructor();
    for (var key in o) {
        if (o.hasOwnProperty(key)) obj[key] = o[attr];
    }
    return o;
};

Object.get = function(o, key, defaultValue, validator){
    if (key in o){
        var val = o[key];
        if (validator !== undefined){
            if (validator(val)){
                return val;
            }
            else {
                throw Error("Invalid argument");
            }
        }
        return val;
    }
    return defaultValue;
};

Array.prototype.indexOf = Array.prototype.indexOf ||
function(obj, start) {
     for (var i = (start || 0), j = this.length; i < j; i++) {
         if (this[i] === obj) { return i; }
     }
     return -1;
}

var console = console || {
    log: function(){
        var elm = document.getElementById('log');
        if (elm){
            elm.html(arguments);
        }
    }
};

var Oops = (function(undefined){

    var oops = {
        version: '1.0'
    };

    oops.Object = function(){

        this.__name__ = "Oops.Object";
        this.property("silent", false);
        this.event("onPropertyChanging")
            .event("onPropertyChanged");
    };

    oops.Object.prototype.event = function(eventName, attachable){
        var subscribers = [];
        var func = function(handler){
            subscribers.push(handler);
            return this;
        };

        func.count = function(){
            return subscribers.length;
        };
        //subscribers = [];
        func.eventName = function(){
            return eventName;
        };

        func.fire = function(obj, args){

        	/*
            if (eventName == "onChanging" && args.propertyName == "alpha"){
                console.log([subscribers[0], subscribers[1]]);
            }*/
            args = args || {};
            args["event"] = eventName;
            //if (subscribers.length > 0) {
            //    console.log([eventName, subscribers.length]);
            //}

            for(var i=0, len=subscribers.length; i<len ; i++){
                var ret = subscribers[i](obj, args);
                if (ret === false){
                    //no more firing, is handler returns falses
                    break;
                }
            }
            return this;
        };

        func.remove = function(handler){
            var index = subscribers.indexOf(handler);
            if (index !== -1){
                subscribers.splice(index, 1);
                func.remove(handler);
            }
            return this;
        };
        if (attachable === undefined){
            this[eventName] = func;
        }
        else {
            attachable[eventName] = func;
        }

        return this;
    };


    oops.Object.prototype.property = function(){

        var _private;
        var prop = arguments[0];
        var defaultVal = arguments[1];
        //console.log(arguments);
        var self = this;
        var keys = prop.split(",");

                for (var index in keys){
                    var key = keys[index];
                    if (index == 0){
                        _private = defaultVal;

                        var property = function() {

                            if (arguments.length == 0){
                                //if (property["getter"] !== undefined){
                                //    return func.getter();
                                //}
                                //getter
                                return _private;
                            }

                            //var isFunc = typeof arugment[0] == "function";
                            else {
                                //setter

                                var newVal = null;
                                var changed = false;

                                newVal = arguments[0];
                                changed = _private !== newVal;

                                //Arguments for events to be fired
                                //Fire value set, fires even if value is not changing.
                                //func.onValueSet.fire(self, args);

                                if (changed){

                                    var propertyName = keys[0]

                                    var silent = self.silent();

                                    if (silent === false || propertyName === 'silent') {
                                        var args = {
                                            propertyName: propertyName,
                                            propertyNames: keys,
                                            oldValue: _private,
                                            newValue: newVal
                                        };

                                        self.onPropertyChanging.fire(self, args);
                                        property.onChanging.fire(self, args);

                                        _private = newVal;
                                        property.onChanged.fire(self, args);
                                        //console.log(self.onPropertyChanged.count());
                                        self.onPropertyChanged.fire(self, args);

                                    }
                                    else {
                                        _private = newVal;
                                    }
                                }
                                return self;
                            }
                        };

                        property.propertyName = keys[0];
                        property.propertyAliases = keys;
                        property.isProperty = true;

                        self.event('onChanging', property);
                        self.event('onChanged', property);
                        self.event('onValueSet', property);

                        self[key] = property;
                    }
                    else {
                        self[key] = self[keys[0]];
                    }
                }
                return self;
    };

    oops.Object.prototype.base = function(){
        return Object.getPrototypeOf(this);
    };

    oops.Object.prototype.set = function(obj){
        if (typeof obj !== 'object'){
            throw Error('Invalid argument, required object parameter');
        }

        for (var key in obj){
            this[key](obj[key]);
        }
    };

    oops.Object.prototype.equals = function(that){
        if (this === that){
            return true;
        }

        for(var key in this){
            if (typeof that[key] === 'undefined'){
                return false;
            }

            var v1 = this[key];
            var v2 = that[key];
            switch(typeof v1){
                case "object":
                    if (v1 instanceof Oops.Object){
                        if (!v1.equals(v2)){
                            return false;
                        }
                    }
                    break;
                case "function":

                    if ("isProperty" in v1){
                        if (v1() != v2()){
                            return false;
                        }
                    }
                    break;
                default:
                    if (v1 != v2){
                        return false;
                    }
            }
        }

        for (var key in that){
            if (typeof this[key] === 'undefined'){
                return false;
            }
        }
        return true;
    };

    oops.Object.prototype.similar = function(that){
        for(var key in that){
            var thatMember = that[key];
            var thisMember = this[key];
            throw new Error("Not implemented");
        }
    };

    oops.Object.prototype.clone = function(cloneTriggers){
        var obj = Object.create(this.constructor.prototype);
        this.constructor.call(obj);
        for(var key in this){

            var item = this[key];
            var type = typeof (item);

            switch (type){
                case "object":{
                    //TODO: Object.clone
                    break;
                }
                case "function":{
                    if ("isProperty" in item){
                        //alert(item.propertyName);
                        var itemVal = item();
                        if (itemVal instanceof Oops.Object){
                            //TODO: To be tested
                            itemVal = itemVal.clone(cloneTriggers);
                        }

                        //copy property attributes.




                        obj[key](itemVal);


                    }
                    else if ("isTrigger" in item){
                        if (cloneTriggers === true){

                        }
                    }
                    break;
                }
                default: {
                    break;
                }

            }

        }

        return obj;
    };

    oops.Object.prototype.load = function load(obj){

        for(var key in obj){
            var type = typeof obj[key];
            var val = obj[key];
            switch(type){
                case "object":{
                    break;
                }
                case "function": {
                    break;
                }
                default: {
                    var member = this[key];
                    if (typeof member === "function"){
                        if ("isProperty" in member){
                            this[key](val);
                        }
                    }
                    else {
                        this[key] = val;
                    }
                    break;
                }
            }
        }

    };
    oops.Object.prototype.stringify = function stringify(object, padding, margin){
        var o = (typeof object == 'object' || typeof object == 'function') && object != null ? object : null;
        var p = typeof padding == 'boolean' && padding ? true : false;
        var m = typeof margin == 'number' && margin>0 && p ? margin : 0;
        if(o != null){
            var s = '';
            var a = function(o){
                    return (typeof o === 'object' && o ? ((typeof o.length === 'number' &&!(o.propertyIsEnumerable('length')) && typeof o.splice === 'function') ? true : false) : false);
            }; //is array?

            for(var v in o){
                s += typeof o[v] === 'object' ? (o[v] ? (
                        (typeof o[v].length === 'number' && !(o[v].propertyIsEnumerable('length')) && typeof o[v].splice === 'function') ?
                        (m>0 ? Array(m).join(' '):'') + v + ':' + (p ? ' ':'') + '[' + (p ? '\r\n':'') + stringify(o[v],p,(m>0?m:1)+v.length+4) + (p!=true ? '' : '\r\n' + Array((m>0?m:1)+v.length+2).join(' ')) + '],' + (p ? '\r\n':'') :
                        (m>0 ? Array(m).join(' '):'') + v + ':' + (p ? ' ':'') + '{' + (p ? '\r\n':'') + stringify(o[v],p,(m>0?m:1)+v.length+4) + (p!=true ? '' : '\r\n' + Array((m>0?m:1)+v.length+2).join(' ')) + '},' + (p ? '\r\n':'')
                    ) : (m>0 ? Array(m).join(' '):'') + v + ':' + (p ? ' ':'') + o[v] + ',' + (p ? '\r\n':''))
                : (m>0 ? Array(m).join(' '):'') + v + ':' + (p ? ' ':'') + (typeof o[v] == 'string' ? '\'' + o[v].replace(/\'/g,'\\\'') + '\'' : o[v]) + ',' + (p ? '\r\n':'');
            };
            o = s.length>0 && p!=true ? s.substring(0, s.length-1) : (s.length>2 ? s.substring(0, s.length-3) : s);
        }else{
            o = object;
        };
        return o;
    };



    return oops;

})();

var $class = (function(undefined){

    function classFunc(proto, base){

        if (base === undefined){
            base = Oops.Object;
        }

        var propInfo = {};

        for (var key in proto){
            var item = proto[key];

            if (item.alias != undefined){
                item.alias = "," + item.alias;
            }
            else {
                item.alias = "";
            }

            propInfo[key] = {
                defaultValue: item.defaultValue,
                propName: key + item.alias
            }
        }

        var callInit = true;

        function obj(){

            base.apply(this, arguments);
            for(var key in proto){

                var item = proto[key];

                if (typeof item == "object" && "type" in item){

                    switch(item.type){
                        case "property": {
                            var info = propInfo[key];
                            //if (key === "lineJoin") {
                            //    console.log([info, propInfo]);
                            //    console.trace();
                            //}
                            this.property(info.propName, info.defaultValue);
                            break;
                        }
                        case "event": {
                            this.event(key);
                            break;
                        }
                        case "static": {
                            var _private;
                            func[key] = function(){
                                if (arguments.length == 0){
                                    return _private;
                                }
                                else {
                                    __private = arguments[0];
                                }
                            };
                            if (item.arguments.length == 1){
                                _private = item.arguments[0];
                            }
                            else {
                                  var defaultVal = item.arguments[0];
                                  for (var i = 1; i<item.arguments.length; i++){
                                    func[item.arguments[i]] = func[key];
                                  }
                            }
                            break;
                        }
                    }
                }
                else {
                    this[key] = item;
                }
            }

            if (callInit === true){
                this.init.apply(this, arguments);
            }
            this.init.__private__ = {};
        }

        var baseProto = new base(); // Object.create(base.prototype);
        //var baseProto = Object.create(base.prototype);

        if (baseProto instanceof Oops.Object === false){
            throw new Error("Invalid base class.");
        }

        obj.prototype = baseProto;
        obj.prototype.constructor = obj;


        if (typeof proto['init'] === 'undefined'){
            obj.prototype.init = function(){
            }
            callInit = false;
        }
        return obj;
    };

    return classFunc;

})();

var $property = function(defaultValue, alias){

    if (defaultValue instanceof Object){
        throw new Error("Setting up object based default value is not allowed, please use init function to set the default value.");
    }
    return {
        type: 'property',
        defaultValue: defaultValue,
        alias: alias
    };
};

var $event = function(){
    return {
        type: 'event'
    };
}

var $static = function(){
	return {
		type: 'static',
		arguments: arguments
	};
};

var Collection = (function(){

    var Collection = $class({

        keyName         : $property('key'),

        //TODO: On prefix to all the events
        itemBeforeAdd   : $event(),
        itemAdded       : $event(),
        itemBeforeRemove: $event(),
        itemRemoved     : $event(),


        init: function(){
            this._items = [];
            this._keys = {};

            if (arguments.length > 0){
                this.push(arguments);
            }
        }

    });

    var cp = Collection.prototype;

    cp.count = function(){
        return this._items.length;
    };

    cp.add = function(item){
        //alert(this.init);
        var items = this._items;
        var keys = this._keys;
        var keyName = this.keyName();

        this.itemBeforeAdd.fire(this, {
            item: item
        });

        if (typeof item === 'object' && item[keyName] !== undefined){
            var key = item[keyName];
            if (typeof key === 'function'){
                key = key();
            }
            if (key !== undefined){
                this._keys[key] = item;
            }
        }
        var length = items.push(item);
        this.itemAdded.fire(this, {
            item: item,
            index: length-1,
            length: length
        });
        return this;
    };


    cp.getItem = function(indexOrKey){
        if (typeof indexOrKey === 'number'){
            return this._items[indexOrKey];
        }
        else if(typeof indexOrKey === 'string'){
            return this._keys[indexOrKey];
        }
        throw "Invalid index or key";
    };

    cp.setItem = function(indexOrKey, value){

        //TODO: donot allow is user change the key...
        var keyName = this.keyName();
        if (typeof indexOrKey === 'number'){
            var item = this._items[indexOrKey]; //validate
            this._items[indexOrKey] = value;
            if (item[keyName] !== undefined){
                var key = item[keyName];
                //reset the key in value if changed...
                //TODO: check it...
                value[keyName] = key;
                this._keys[key] = value;
                return this;
            }
        }
        else if(typeof indexOrKey === 'string'){
            var item = this._keys[indexOrKey];
            if (item !== undefined){
                var index = this.indexOf(item);
                this._items[index] = value; //validate
                this._keys[indexOrKey] = value;
                return this;
            }
        }
        throw "Invalid index or key";
    };

    cp.remove = function(indexOrKey){

        var index = -1,
            item;

        if (typeof indexOrKey === 'number'){
            index = indexOrKey;
            item = this._items[index];
        }
        else if(typeof indexOrKey === 'string'){
            item = this._keys[item];
            index = this.indexOf(item);
        }
        else {
            throw "Invalid index or key";
        }

        this.itemBeforeRemove.fire(this, {
            index: index,
            item: item
        });

        var keyName = this.keyName();
        var key = item[keyName];
        if (key === undefined){

        }
        this._items.splice(index, 1); //delete array item
        this.itemRemoved.fire(this, {
            item: item
        });

        return this;

        //Derived from john resig method: http://ejohn.org/blog/javascript-array-remove/
        //Prams
        //var from
        //var to = from + 1;
        //var rest = this.slice((to || from) + 1 || this.length);
        //var rest = Array.prototype.slice.call(this._items, (to || from) + 1 || _items.length);
        //var rest = Array.prototype.slice.call(this._items, (to || from) + 1 || _items.length);
        //this.length = from < 0 ? this.length + from : from;
        //return this.push.apply(_items, rest);

    };

    cp.indexOf = function(item) {
        return this._items.indexOf(item);
    };

    cp.items = function(){
        return this._items;
    };

    cp.toArray = function(){
        return this._items;
    };

    cp.each = function(callback){
        var items = this._items;
        for(var i=0, len = items.length; i<len; i++){
            callback(items[i]);
        }
        return this;
    };

    return Collection;

})();


var X = $class({

    r: $property(10),
    g: $property(20),
    b: $property(30),
    name: $property("aamir")


});


var x = new X();
x.r(100);
x.name("aamir")
var y = x.clone();
y.name("kabir");
console.log([x.name(), y.name()]);
