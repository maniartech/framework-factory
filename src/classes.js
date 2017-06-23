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
                meta = {},
                create = Object.create,
                hasProp = Object.prototype.hasOwnProperty;

            // Setup parent.
            if ($f[defaultBaseClass] !== undefined) {
                parent  = parent || $f[defaultBaseClass];
            }
            else {
                parent = parent || Object;
            }

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
            prototype = _extendClass(constructorFn, parent);

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
                            typeHandler = FrameworkFactory.typeHandlers.get(item.typeHandler);
                            if (typeHandler !== undefined && typeHandler.handler !== undefined) {
                                typeHandler.handler(constructorFn, key, item);
                                processed = true;
                            }
                        }
                        else if (type === 'function' &&
                                typeof parent.prototype[key] === 'function' &&
                                fnTest.test(item)) {
                            prototype[key] = (function (key, fn) {
                                var parentFn = parent;

                                return function () {
                                    this.base =  parentFn.prototype[key];
                                    var ret = fn.apply(this, arguments);
                                    this.base = undefined;
                                    return ret;
                                }
                            })(key, item);
                            processed = true;
                        }

                        if (!processed) {
                            prototype[key] = val;
                        }
                    }

                    meta[key] = item;
                }

            };

            // Returns the extended class.
            constructorFn.extend = function extend(o) { return _createClass(o, constructorFn); };

            _setupTypeHandlers(constructorFn);

            constructorFn.attach(prop);

            // Setup Meta Framework

            function _gmn(ownMembersOnly) {
                var keys = Object.keys(meta);
                if (!ownMembersOnly && $f.is.func(parent.getMemberNames)) {
                    return keys.concat(parent.getMemberNames());
                }
                return keys;
            }

            function _gm (member) {
                if (member in meta) {
                    return meta[member];
                }
                else if ($f.is.func(parent.getMember)) {
                    return parent.getMember(member);
                }
            }

            /**
             * Returns the detail about registered member in the specified class
             * @function $f.getMemberInfo( member)
             * @param  {string} member The name of the member
             * @returns {any} An object describing member detail.
             **/
            constructorFn.getMember = function (member) { return _gm(member); };

            /**
             * Returns an array of all the registered member keys including members of base class. If ownMemberOnly is
             * passed as true,
             * @function $f.getMembers( ownMembersOnly )
             * @param  {string} ownMembersOnly The name of the member
             * @returns {Array(string)} An array of string having all the registed member keys.
             **/
            constructorFn.getMemberNames = function (ownMembersOnly) { return _gmn(ownMembersOnly); };

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
            subClass.prototype              = Object.create(superClass.prototype);
            subClass.prototype.constructor  = subClass;

            return subClass.prototype;
        }

        // Initializes the type handlers for specified class.
        function _setupTypeHandlers(constructorFn) {
            var typeHandlers = FrameworkFactory.typeHandlers.getTypeHandlers(),
                typeHandler,
                i, iLen;

            for (i=0, iLen=typeHandlers.length; i < iLen; i += 1) {
                typeHandler = FrameworkFactory.typeHandlers.get(typeHandlers[i]);
                if (typeHandler.setup) {
                    typeHandler.setup(constructorFn);
                }
            }
        }
    }

    FrameworkFactory.plugins.register({
        name: 'classes',
        load: classes
    });

})(root);
