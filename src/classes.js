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
            defaultBaseClass = $f.config('defaultBaseClass'),
            requireNew = $f.config('requireNew', false),
            Class;

        Class = function (prop, parent) {
            var hasProp = Object.prototype.hasOwnProperty,
                proto, key, Constructor, __base__, funcString,
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

            if (requireNew) {
                Constructor = function Object() {
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
                Constructor = function Object() {
                    var init = initializing,
                        inst = null;
                    if(this instanceof Constructor === false) {
                        initializing = true;
                        inst = new Constructor();
                        initializing = init;
                        if (initializing === false && inst.init !== undefined) {
                            inst.init.apply(inst, arguments);
                        }
                        return inst;
                    }
                    //this.constructor = Constructor;
                    if (initializing === false && this.init !== undefined) {
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
            proto.base = __base__;

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

                        if (!processed) {
                            proto[key] = val;
                        }
                        Constructor.__meta__[key] = item;
                    }
                }
                _updateMeta(Constructor);
            };

            Constructor.__meta__ = {};
            Constructor.__baseMeta__ = __base__.constructor.__meta__;
            _initTypeHandlers(Constructor);
            Constructor.attach(prop);

            //return
            return Constructor;

        };

        $f.Class = Class;

    }

    plugin.info = {
        name: "classes"
    };

    FrameworkFactory.plugins.register(plugin);

})(this);