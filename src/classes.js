this.counter = 0;
(function (global, undefined) {
    "use strict";

    function _plainObject (val) {
        if (val === undefined || val === null) { return false; }
        return ((typeof val === 'object') && (val.constructor === Object));
    }

    function _copyKeys(o, newO, updateMeta) {
        var key, val;

        for(key in o) {
            if (o.hasOwnProperty(key)) {
                val = o[key];
                newO[key] = val;
                if (updateMeta) {
                    if (_plainObject(val)) {
                        console.log(val);
                    }
                }
            }
        }
    }

    function _updateMeta(Class) {
        var meta = {},
            curMeta = Class.__meta__,
            parentMeta = Class.__super__.constructor.__meta__;

        if(parentMeta) {
            _copyKeys(parentMeta, meta);
        }

        _copyKeys(meta, curMeta, true);
    }

    function plugin($f) {

        var initializing = true,
            fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            defaultBaseClass = $f.config('defaultBaseClass'),
            requireNew = $f.config('requireNew', false),
            Class;

        Class = function (prop, parent) {
            //Checks if base exists in overriden function, inspired by John Resig's class
            //implementation.
            var hasProp = Object.prototype.hasOwnProperty,
                proto, key, Class, __super__, funcString,
                customParent = false;

            if ($f[defaultBaseClass] !== undefined) {
                parent  = parent || $f[defaultBaseClass];
                customParent = true;
            }
            else {
                parent = parent || Object;
            }
            prop    = prop || {};

            //prevents call to
            initializing = true;
            proto = new parent;
            //proto = Object.create(parent.prototype)
            initializing = false;

            Class = function Object() {
                if (requireNew && this instanceof Class === false) {
                    throw new Error('Class used as function.');
                }
                else if(requireNew === false && this instanceof Class === false) {
                    var inst = Object.create(proto);
                    if (initializing === false && inst.init !== undefined) {
                        inst.init.apply(inst, arguments);
                    }
                    return inst;
                }
                //this.constructor = Class;
                if (initializing === false && this.init !== undefined) {
                    this.init.apply(this, arguments);
                }
            };

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
                    key,
                    typeHandler;

                for(key in prop) {
                    if (hasProp.call(prop, key)) {
                        item = prop[key];
                        type = typeof item;
                        val = item;
                        processed = false;

                        if ($f.is.plainObject(item)) {
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
                counter += 1;
                _updateMeta(Class);
            };

            Class.__meta__ = {};

            Class.attach(prop);

            //return
            return Class;

        };

        $f.Class = Class;

    }

    plugin.toString = function() {
        return "plugin";
    };

    plugin.info = {
        name: 'plugin'
    };

    FrameworkFactory.plugins.register(plugin);


})(this);