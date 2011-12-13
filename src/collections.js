
    /*
     * @class Represents the collection class
     **/
    _framework.Collection = _framework.Class({

        keyName         : $property('name'),

        //TODO: On prefix to all the events
        itemBeforeAdd   : $event(),
        itemAdded       : $event(),
        itemBeforeRemove: $event(),
        itemRemoved     : $event(),
        itemBeforeSet   : $event(),
        itemSet         : $event(),

        init: function() {
            this._items = [];
            this._keys = {};

            if (arguments.length > 0) {
                this.add.apply(this, arguments);
            }
        },

        count: function() {
            return this._items.length;
        },

        add: function() {

            //alert(this.init);
            var items = this._items,
                keys = this._keys,
                _keyName = getPrivateKey('keyName'),  keyName = this[privKey];

            for (var i=0, len=arguments.length; i<len; i++) {

                var item = arguments[i];

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
            }
            return this;
        },

        getItem: function(indexOrKey){
            if (typeof indexOrKey === 'number'){
                return this._items[indexOrKey];
            }
            else if(typeof indexOrKey === 'string'){
                return this._keys[indexOrKey];
            }
            throw "Invalid index or key";
        },

        setItem: function(indexOrKey, value){

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
        },

        remove: function(indexOrKey) {

            var index = -1,
                item, keyName, key;

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

            keyName = this.keyName();
            key = item[keyName];
            if (key === undefined){

            }
            this._items.splice(index, 1); //delete array item
            this.itemRemoved.fire(this, {
                item: item
            });

            return this;
        },

        indexOf: function(item) {
            return this._items.indexOf(item);
        },

        items: function(){
            return this._items;
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

    }, _framework.Component);
