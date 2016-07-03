(function (root, undefined) {
    "use strict";

    function classes($f) {

        var fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            defaultBaseClass = $f.config('defaultBaseClass'),
            requireNew = $f.config('requireNew', false),
            Class;

        /**
         * Define a new class.
         *
         * @function $f.Class(prop, [parent])
         * @param {Object}      prop   [description]
         * @param {[BaseClas}   parent [description]
         *
         * @example
         * $f.Test = $f.Class({
         *
         *     // Constructor for $f.Test class.
         *     init: (name) {
         *         this.name = name;
         *     },
         *
         *     // Returns currently set name.
         *     getName: function getName() {
         *         return this.name;
         *     }
         *
         * });
         *
         * @returns {Function}  Returns a constructor function.
         *
         * @memberof $f
         * @public
         */
        Class = function Class(prop, parent) {
            var hasProp = Object.prototype.hasOwnProperty,
                proto, key, Constructor, __base__, funcString,
                create = Object.create;

            // Setup parent.
            if ($f[defaultBaseClass] !== undefined) {
                parent  = parent || $f[defaultBaseClass];
            }
            else {
                parent = parent || Object;
            }

            // Setup prop
            prop    = prop || {};

            // Setup Constructor
            if (requireNew) {
                Constructor = function Object() {
                    if (this instanceof Constructor === false) {
                        throw new Error('Constructor used as function.');
                    }
                    //this.constructor = Constructor;
                    if (this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }
            else {
                Constructor = function Object() {
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

            // Setup Inheritance
            _extend(Constructor, parent);
            __base__ = Constructor.__base__;

            proto = Constructor.prototype;

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
                            typeHandler = FrameworkFactory.typeHandlers.get(item.type);
                            if (typeHandler !== undefined && typeHandler.handler !== undefined) {
                                typeHandler.handler(Constructor, key, item);
                                processed = true;
                            }
                        }
                        else if (type === 'function' &&
                                typeof __base__[key] === 'function' &&
                                fnTest.test(item)) {
                            proto[key] = (function (key, fn) {
                                var baseFunc = function base () {
                                        return __base__[key].apply(this, arguments);
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
            Constructor.__baseMeta__ = Constructor.__base__.constructor.__meta__;
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

        // Extends subClass with superClass
        function _extend(subClass, superClass) {

            // Coopy static members from superClass to subClass
            for (var key in superClass) {
                if (Object.prototype.hasOwnProperty.call(superClass, key)) {
                    subClass[key] = superClass[key];
                }
            }

            // Inherit
            subClass.prototype              = Object.create(superClass.prototype);
            subClass.prototype.constructor  = subClass;
            subClass.__base__               = superClass.prototype;

            return subClass;
        }

        // Initializes the type handlers for specified class.
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

        // Copies attributes from an object to newObject.
        // If override is set to false, does not copy attribute into new object
        // when new object already has said attribute.
        function _copyKeys(o, newO, override) {
            var key, val;

            override = (override === undefined) ? true : override;

            for(key in o) {
                if (o.hasOwnProperty(key)) {
                    val = o[key];
                    if (override) {
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

    }

    FrameworkFactory.plugins.register(classes);

})(this);