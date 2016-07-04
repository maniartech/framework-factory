(function (root, undefined) {
    "use strict";

    function classes($f) {

        var fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            defaultBaseClass = $f.config('defaultBaseClass'),
            requireNew = $f.config('requireNew', false),
            _createClass;

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
         *     // constructorFn for $f.Test class.
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
        _createClass = function (prop, parent) {
            var prototype,
                key,
                constructorFn,
                meta,
                create = Object.create,
                hasProp = Object.prototype.hasOwnProperty;

            // Setup parent.
            if ($f[defaultBaseClass] !== undefined) {
                parent  = parent || $f[defaultBaseClass];
            }
            else {
                parent = parent || Object;
            }

            // Setup meta
            meta = {}

            // Setup prop
            prop    = prop || {};

            // Setup constructorFn
            if (requireNew) {
                constructorFn = function Object() {
                    if (this instanceof constructorFn === false) {
                        throw new Error('constructorFn used as function.');
                    }
                    //this.constructor = constructorFn;
                    if (this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }
            else {

                constructorFn = function Object () {
                    var inst = null;

                    // constructorFn is called as function,
                    // instanciate it and return instance object.
                    if(this instanceof constructorFn === false) {
                        inst = create(constructorFn.prototype);
                        if (inst.init !== undefined) {
                            inst.init.apply(inst, arguments);
                        }
                        return inst;
                    }
                    //this.constructor = constructorFn;
                    if (this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }

            // Setup Inheritance
            _extendClass(constructorFn, parent);
            prototype = constructorFn.prototype;

            // Attaches the new member to the
            // constructorFn prototype.
            constructorFn.attach = function attach(prop) {
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
                                typeHandler.handler(constructorFn, key, item);
                                processed = true;
                            }
                        }
                        else if (type === 'function' &&
                                typeof parent.prototype[key] === 'function' &&
                                fnTest.test(item)) {
                            prototype[key] = (function (key, fn) {
                                var baseFn, wrapperFn;
                                // baseFn = function base () {
                                //     return __base__[key].apply(this, arguments);
                                // };
                                //

                                //baseFn = __base__[key];
                                var parentClass = parent;

                                wrapperFn = function () {
                                    this.base =  parentClass.prototype[key];
                                    var ret = fn.apply(this, arguments);
                                    this.base = undefined;
                                    return ret;
                                }

                                return wrapperFn;
                            })(key, item);
                            processed = true;
                        }

                        if (!processed) {
                            prototype[key] = val;
                        }
                        constructorFn.__meta__[key] = item;
                    }
                }
                _updateMeta(constructorFn, meta);

            };

            // Returns the extended class.
            constructorFn.extend = function extend(o) {
                return _createClass(o, constructorFn);
            };

            constructorFn.getMemberInfo = function getMemberInfo(member) {
                if (member in )
            };

            constructorFn.__meta__ = {};
            constructorFn.__baseMeta__ = parent.__meta__;
            _initializeTypeHandlers(constructorFn);
            constructorFn.attach(prop);

            //return
            return constructorFn;

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
        $f.Class = function () { return _createClass.apply(null, arguments) };

        // Extends subClass with superClass
        function _extendClass(subClass, superClass) {

            // Coopy static members from superClass to subClass
            for (var key in superClass) {
                if (Object.prototype.hasOwnProperty.call(superClass, key)) {
                    subClass[key] = superClass[key];
                }
            }

            // Inherit
            subClass.prototype              = createObject(superClass.prototype);
            subClass.prototype.constructor  = subClass;

            return subClass;
        }

        // Initializes the type handlers for specified class.
        function _initializeTypeHandlers(Class) {
            var types = FrameworkFactory.typeHandlers.getTypes(),
                type, typeHandler,
                i, iLen;

            for (i=0, iLen=types.length; i < iLen; i += 1) {
                type = types[i];
                typeHandler = FrameworkFactory.typeHandlers.get(type);
                if (typeHandler.setup) {
                    typeHandler.setup(Class);
                }
            }
        }

        // Copies attributes from an sourceObj to destinationObj.
        // If override is set to false, does not copy attribute into new object
        // when new object already has said attribute.
        function _copyKeys(sourceObj, destinationObj, override) {
            var key, val;

            override = (override === undefined) ? true : override;

            for(key in sourceObj) {
                if (sourceObj.hasOwnProperty(key)) {
                    val = sourceObj[key];
                    if (override) {
                        destinationObj[key] = val;
                    }
                    else {
                        if(key in destinationObj === false) {
                            destinationObj[key] = val;
                        }
                    }
                }
            }
        }

        function _updateMeta(constructorFn, metaObj) {
            var parentMeta = {};

            if(constructorFn.constructor.__baseMeta__) {
                _copyKeys(constructorFn.constructor.__baseMeta__, parentMeta);
            }

            _copyKeys(parentMeta, metaObj, false);
        }

    }

    FrameworkFactory.plugins.register(classes);

})(root);
