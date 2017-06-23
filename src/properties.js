
(function (root, undefined) {
    "use strict";

    function properties($f) {

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

        function attachReadonly(obj, key, getter) {
            attachProperty(obj, key, getter);
        }

        /**
         * Attaches readonly member to associated class.
         */
        readonly = function readonly(options, tag) {
            var get, value;
            // TODO: Change value to 'default'

            if ($f.is.plainObject(options)) {
                value = options.default;
                if ($f.is.func(options.get)) {
                    get = options.get;
                }
            }
            else {
                value = options;
            }

            tag = tag || {};

            return {
                typeHandler     : 'readonlies',
                default         : value,
                readonly        : true,
                get             : get,
                tag             : tag
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
        property = function property(options, tag) {

            var valueOf,
                value,
                get, set;

            if ($f.is.plainObject(options)) {
                value = options.default;
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

            tag = tag || {};

            return {
                typeHandler : 'properties',
                readonly    : false,
                default     : value,
                get         : get,
                set         : set,
                tag        : tag
            };
        };

        handler = function (Class, key, options) {

            var proto       = Class.prototype, _get, _set,
                readonly    = options.readonly,
                getter      = options.get,
                setter      = options.set,
                privateKey  = '_' + key,
                value       = options.default;

            options.name = key;

            if (readonly) {
                if (getter !== undefined) {
                    _get = getter;
                }
                else {
                    _get = function () {
                        return this[privateKey];
                    };
                    options.get = _get;
                }
            }
            else {

                _get = getter || function () {
                    return this[privateKey];
                };

                _set = setter || function (v) {
                    this[privateKey] = v;
                };
                options.get = _get;
                options.set = _set;
            }

            if (value !== undefined) {
                proto[privateKey] = value;
            }

            attachProperty(proto, key, _get, _set);
        };

        $f.attachProperty = attachProperty;
        $f.attachReadonly = attachReadonly;
        $f.property     = property;
        $f.readonly     = readonly;

        FrameworkFactory.typeHandlers.register({
            typeHandler: "properties",
            handler: handler
        });

        FrameworkFactory.typeHandlers.register({
            typeHandler: "readonlies",
            handler: handler
        });
    }

    FrameworkFactory.plugins.register({
        name: "properties",
        load: properties
    });

})(this);
