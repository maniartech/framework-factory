
(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function plugin($f) {

        var readonly, property, handler;

        /**
         * Attaches the property to the given object. If setter is not specified creates reaonly property.
         * @param {Object} obj The object on which property has to be attached.
         * @param {string} key The key or name of the property.
         * @param {function} getter The getter function, this function will be called whenever get
         *        operation is required.
         * @param {function} setter The setter function, this function will be called whenever set
         *        operation is required. If this setter is missing, it will make the property readonly.
         *        And will throw an errror whenever property is set.
         * @public
         * @version 1.0
         **/
        function attachProperty(obj, key, getter, setter) {

            setter = setter || function () {
                throw new Error('Cannot assign to readonly property "' + key + '".');
            };

            if (Object.defineProperty) {
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    get: getter,
                    set: setter
                });
            }
            else if (obj.__defineGetter__ !== undefined) {
                obj.__defineGetter__(key, getter);
                obj.__defineSetter__(key, setter);
            }
            else {
                throw new Error("Properties are not supported in current environment.");
            }
        }

        /**
         *
         */
        readonly = function readonly(options) {
            var get, value;

            if ($f.is.plainObject(options)) {
                value = options.value;
                if ($f.is.func(options.get)) {
                    get = options.get;
                }
            }
            else {
                value = options;
            }

            return {
                type            : 'readonly',
                value           : value,
                readonly        : true,
                get             : get,
                set             : undefined
            };
        };

        /**
         * While defining class, this function sets the member as
         * a property.
         * @param: defaultValue, the default value of property
         * @param: firePropertyChanged, if true,
         * @function
         * @public
         * @version 1.0.0
         **/
        property = function property(options) {

            var valueOf,
                value,
                get, set;

            if ($f.is.plainObject(options)) {
                value = options.value;
                get = options.get;
                set = options.set;

                //If get is provided but not set, return readonly version.
                if (get && !set) {
                    return readonly(options);
                }
            }
            else {
                value = options;
            }

            return {
                type : 'property',
                readonly : false,
                value : value,
                get : get,
                set : set
            };

            // if (typeof options === 'object') {
            //     valueOf = options.valueOf();
            //     //Incase of Object based primitive plugin like
            //     // new String('abc')
            //     // new Date('123')
            //     if (typeof valueOf !== 'object' && typeof valueOf !== 'function') {
            //         //Set primitive
            //         value = options.value;
            //         get = options.get;
            //     }
            //     else {
            //         //If is object but only getter is found
            //         observable  = false;
            //         value       = options.value;
            //         if (options.get !== undefined && options.set === undefined) {
            //             readonly = true;
            //             if (arguments[1] === true) {
            //                 observable = true;
            //             }
            //         }
            //         else if (options.get === undefined && options.set === undefined) {
            //             throw new Error('Neither get nor set found in property declaration. This type of object is not currently supported.');
            //         }
            //         else {
            //             get = options.get;
            //             set = options.set;
            //         }
            //     }
            // }
            // else {
            //     value = options;
            //     if (arguments[1] === true) {
            //         observable = true;
            //     }
            // }

            // options = options || {};

            // return {
            //     type        : 'property',
            //     value       : value,
            //     readonly    : readonly,
            //     get         : options.get,
            //     set         : options.set
            // };
        };

        handler = function (Class, key, options) {

            var proto       = Class.prototype, _get, _set,
                readonly    = options.readonly,
                getter      = options.get,
                setter      = options.set,
                privateKey     = '_' + key,
                value       = options.value;

            if (readonly) {
                if (getter !== undefined) {
                    _get = getter;
                }
                else {
                    _get = function () {
                        return this[privateKey];
                    };
                }
            }
            else {

                _get = getter || function () {
                    return this[privateKey];
                };

                _set = setter || function (v) {
                    this[privateKey] = v;
                };

            }

            if (value !== undefined) {
                proto[privateKey] = value;
            }

            // return;

            // if (getter !== undefined && setter === undefined) {
            //     if (value !== undefined) {
            //         proto[privateKey] = options.value;
            //     }
            // }
            // else {
            //     proto[privateKey] = options.value;
            // }

            // _get = getter || function get() {
            //     return this[privateKey];
            // };

            // if (readonly) {
            //     _set = function readonlySet() {
            //         throw new Error('Cannot assign to readonly property "' + key + '".');
            //     };
            // }
            // else {
            //     if (setter !== undefined) {
            //         if (!observable) {
            //             _set = setter;
            //         }
            //         else {
            //             _set = function (v) {
            //                 var oldVal = this[key],
            //                     args;

            //                 if (oldVal === v) {
            //                     return; //property not changed.
            //                 }

            //                 args = {
            //                     propertyName: key,
            //                     oldValue: oldVal,
            //                     newValue: v
            //                 };
            //                 this.trigger(changingEvent, args);
            //                 setter.call(this, v);
            //                 this.trigger(changeEvent, args);
            //             };
            //         }
            //     }
            //     else {

            //         if (!observable) {
            //             _set = function (v) {
            //                 this[privateKey] = v;
            //             };
            //         }
            //         else {
            //             _set = function set(v) {
            //                 var oldVal = this[privateKey],
            //                     args;

            //                 if (oldVal === v) {
            //                     return; //Property not changed.
            //                 }
            //                 args = {
            //                     propertyName: key,
            //                     oldValue: oldVal,
            //                     newValue: v
            //                 };
            //                 this.trigger(changingEvent, args);
            //                 if (this.onPropertyChanging) {
            //                     this.onPropertyChanging(args);
            //                 }
            //                 this[privateKey] = v;
            //                 this.trigger(changeEvent, args);
            //                 if (this.onPropertyChanged) {
            //                     this.onPropertyChanged(args);
            //                 }
            //             };
            //         }
            //     }
            // }

            attachProperty(proto, key, _get, _set);
        };

        $f.attachProperty = attachProperty;
        $f.property     = property;
        $f.readonly     = readonly;

        FrameworkFactory.typeHandlers.register({
            type: "property",
            handler: handler
        });

        FrameworkFactory.typeHandlers.register({
            type: "readonly",
            handler: handler
        });

    }

    plugin.info = {
        name: 'properties'
    };

    plugin.toString = function toString() {
        return plugin.info.name;
    };

    FrameworkFactory.plugins.register(plugin);

})(this);
