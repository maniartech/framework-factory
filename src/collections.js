

    $f.collections = {};
    var collections = $f.collections;

    collections.ObservableList = $f.Class({

    }, Object);


    /**
     * A collection class which stores both indexes as well as keys.
     * @class framework.collection.MapList
     * @name framework.collections.MapList.prototype
     **/
    collections.MapList = $f.Class({

        /**
         * Represents total number of items in the list.
         **/
        length          : $f.readonly(0),

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

            for (var i=0, len=arguments.length; i<len; i++) {
                item = arguments[i];
                var args = {
                    item: item,
                    act: true
                };
                this.trigger('itemBeforeAdd', args);
                if (args.act === false) {
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
                            throw new Error('Item with this key already exists.');
                        }
                        keys.push(key);
                        map[key] = item;
                    }
                }

                //Add item to an array.
                this._length = items.push(item);;

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
    collections.MapList.loadFromJSON = function set(colObj, value) {
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
