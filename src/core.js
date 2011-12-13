
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
