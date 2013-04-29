

var components = FrameworkFactory.create({
    name: "components",
    version: "1.0"
});

components.Component = framework.Class({
    name : framework.property('', true),
    width: framework.property({
        value: 0,
        get: function() {
            return this._width;
        },
        set: function(v) {
            this._width = v;
        }
    }),

    click: function() {
        this._clickCount += 1;
    },
    clickCount: framework.readonly({
        value: 0,
        get: function() {
            return this._clickCount;
        }
    }),

    length: framework.readonly(0),
    add: function() {
        this._length += 1;
    }
});


/**
 * A collection class which stores both indexes as well as keys.
 * @class components.collection.MapList
 * @name components.collections.MapList.prototype
 **/
components.collections.MapList = components.Class({

    /**
     * Represents total number of items in the list.
     **/
    length          : components.property({
        get: function() {
            return this._items.length;
        }
    }),

    /**
     * Key identifier in the item object.
     * @lends components.collections.MapList
     **/
    keyName         : 'id',

    validator       : undefined,

    itemBeforeAdd   : components.event(),
    itemAdd         : components.event(),
    itemBeforeRemove: components.event(),
    itemRemoved     : components.event(),
    itemBeforeSet   : components.event(),
    itemSet         : components.event(),

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
components.collections.MapList.importObject = function importObject(o, key, value) {
    var colObj = o[key];
    if (colObj instanceof components.collections.MapList === false) {
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

components.Button = framework.Class({

    //Attributes
    clickCount: framework.attribute(0),

    caption: framework.attribute('Button'),

    isDefault: framework.attribute(false),

    //Events
    click: framework.event(),
    mouseMove: framework.event(),

    //Constructor
    init: function(caption) {
        if (caption) {
            this.caption = caption;
        }
    }
});

components.Shape = framework.Class({
    id: 'shape',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    init: function() {
        this.children = new framework.collections.MapList();
        if (arguments.length > 0) {
            framework.utils.importObject(this, arguments[0]);
        }
    }
});









