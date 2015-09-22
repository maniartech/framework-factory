(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function _initTypeHandlers(Class) {
        var types = FrameworkFactory.typeHandlers.getTypes(),
            type, typeHandler,
            i, iLen;

        for (i=0, iLen=types.length; i < iLen; i += 1) {
            type = types[i];
            typeHandler = FrameworkFactory.typeHandlers.get(type);
            if (typeHandler.init) {
                typeHandler.init(Class);
            }
        }
    }

    function _plainObject (val) {
        if (val === undefined || val === null) { return false; }
        return ((typeof val === 'object') && (val.constructor === Object));
    }

    function _copyKeys(o, newO, overrideExisting) {
        var key, val;

        overrideExisting = (overrideExisting === undefined) ? true : overrideExisting;

        for(key in o) {
            if (o.hasOwnProperty(key)) {
                val = o[key];
                if (overrideExisting) {
                    newO[key] = val;
                }
                else {
                    if(key in newO === false) {
                        newO[key] = val;
                    }
                }
            }
        }
    }

    function _updateMeta(Class) {
        var meta = Class.__meta__,
            parentMeta = {};

        if(Class.constructor.__baseMeta__) {
            _copyKeys(Class.constructor.__baseMeta__, parentMeta);
        }

        _copyKeys(parentMeta, meta, false);
    }

    function plugin($f) {

        var initializing = true,
            fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            defaultBaseClass = $f.config('defaultBaseClass'),
            requireNew = $f.config('requireNew', false),
            Class;

        Class = function (prop, parent) {
            var hasProp = Object.prototype.hasOwnProperty,
                proto, key, Constructor, __base__, funcString,
                create = Object.create;

            if ($f[defaultBaseClass] !== undefined) {
                parent  = parent || $f[defaultBaseClass];
            }
            else {
                parent = parent || Object;
            }
            prop    = prop || {};
            proto = create(parent.prototype);

            if (requireNew) {
                Constructor = function () {
                    if (this instanceof Constructor === false) {
                        throw new Error('Constructor used as function.');
                    }
                    //this.constructor = Constructor;
                    if (initializing === false && this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }
            else {
                Constructor = function () {
                    var inst = null;

                    // Constructor is called as function,
                    // instanciate it and return instance object.
                    if(this instanceof Constructor === false) {
                        inst = create(Constructor.prototype);
                        if (inst.init !== undefined) {
                            inst.init.apply(inst, arguments);
                        }
                        return inst;
                    }
                    //this.constructor = Constructor;
                    if (this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }

            //for each static members in parents, copy'em to child
            for (key in parent) {
                //if parent owns the key, set child item = parent item
                if (hasProp.call(parent, key)) {
                    Constructor[key] = parent[key];
                }
            }

            __base__ = parent.prototype;

            Constructor.prototype = proto;
            Constructor.prototype.constructor = Constructor;
            Constructor.__base__ = __base__;

            // Attaches the new member to the
            // Constructor prototype.
            Constructor.attach = function attach(prop) {

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
                            typeHandler = FrameworkFactory.typeHandlers.get(item.type).handler;
                            if (typeHandler !== undefined) {
                                typeHandler(Constructor, key, item);
                                processed = true;
                            }
                        }
                        else if (type === 'function' &&
                                typeof __base__[key] === 'function' &&
                                fnTest.test(item)) {
                            proto[key] = (function (key, fn) {
                                var baseFunc = function () {
                                        __base__[key].apply(this, arguments);
                                    },
                                    wrapper = function () {
                                        this.base =  baseFunc;
                                        var ret = fn.apply(this, arguments);
                                        this.base = null;
                                        return ret;
                                    };
                                return wrapper;
                            })(key, item);
                            processed = true;
                        }

                        if (!processed) {
                            proto[key] = val;
                        }
                        Constructor.__meta__[key] = item;
                    }
                }
                _updateMeta(Constructor);
            };

            // Returns the extended class.
            Constructor.extend = function extend(o) {
                return $f.Class(o, Constructor);
            };

            Constructor.__meta__ = {};
            Constructor.__baseMeta__ = __base__.constructor.__meta__;
            _initTypeHandlers(Constructor);
            Constructor.attach(prop);

            //return
            return Constructor;

        };

        /**
         * Creates a new class for $f.
         * @function Class(o)
         * @param {object} o The class definition object.
         * @example
         * $f.Test = $f.Class()
         *
         * @public
         * @version 1.0
         **/
        $f.Class = Class;


    }

    plugin.info = {
        name: "classes"
    };

    FrameworkFactory.plugins.register(plugin);

})(this);