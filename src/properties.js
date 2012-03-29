
(function (global, undefined) {
    "use strict";

    function properties($f, config) {

        /**
         * While defining class, this function sets the member as
         * a property.
         * @param: defaultValue, the default value of property
         * @param: firePropertyChanged, if true,
         * @function
         * @public
         * @version 1.0.0
         **/
        var property = function property(defaultValue, options) {

                options = options || {};
                return {
                    type: 'property',
                    defaultValue: defaultValue,
                    readonly: false,
                    silent: options.silent || false,
                    get: options.get,
                    set: options.set
                };
            },

            /**
            * While defining class, this function sets the member as
            * a property.
            * @param: defaultValue, the default value of property
            * @param: firePropertyChanged, if true,
            * @function
            * @public
            * @version 1.0.0
            **/
            propertyGS = function propertyGS(options) {

                if (options.get === undefined || options.set === undefined) {
                    throw new Error('Required options missing, please check get and set functions supplied.');
                }

                return {
                    type: 'property',
                    defaultValue: undefined,
                    readonly: false,
                    silent: options.silent || false,
                    get: options.get,
                    set: options.set
                };
            },

            /**
             *
             */
            readonly = function readonly(defaultValue, options) {
                options = options || {};
                return {
                    type: 'readonly',
                    defaultValue: defaultValue,
                    readonly: true,
                    silent: false,
                    get: options.get
                };
            },

            handler = function (Class, key, options) {

                var proto = Class.prototype, _get, _set,
                    readonly = options.readonly,
                    silent = options.silent || false,
                    getter = options.get,
                    setter = options.set,
                    privKey = '_' + key;

                proto[privKey] = options.defaultValue;

                if (proto.propertyChanged === undefined) {

                    Class.attach({
                        propertyChanging: $f.event(),
                        propertyChanged : $f.event(),
                        triggerPropertyChanging: function triggerPropertyChanging(oldValue, newValue) {
                            var args = {
                                propertyName: key,
                                oldValue: oldValue,
                                newValue: newValue
                            };
                            this.trigger('propertyChanging', args);
                        },
                        triggerPropertyChanged: function triggerPropertyChanged(oldValue, newValue) {
                            var args = {
                                propertyName: key,
                                oldValue: oldValue,
                                newValue: newValue
                            };
                            this.trigger('propertyChanged', args);
                        }
                    });
                }

                //console.log('In set', setter);


                _get = getter || function get() {
                    return this[privKey];
                };

                if (setter !== undefined) {
                    if (silent) {
                        _set = setter;
                    }
                    else {
                        _set = function (v) {
                            var oldVal = this[key],
                                args;

                            if (oldVal === v) {
                                return; //property not changed.
                            }

                            args = {
                                propertyName: key,
                                oldValue: oldVal,
                                newValue: v
                            };
                            this.trigger('propertyChanging', args);
                            setter.call(this, v);
                            this.trigger('propertyChanged', args);
                        };
                    }
                }
                else if (readonly === true) {
                    _set = function readonlySet() {
                        throw new Error('You are not allowed to write to readonly attribute "' + key + '".');
                    };
                }
                else {
                    if (silent) {
                        _set = function (v) {
                            this[privKey] = v;
                        };
                    }
                    else {
                        _set = function set(v) {
                            var oldVal = this[privKey],
                                args;

                            if (oldVal === v) {
                                return; //Property not changed.
                            }
                            args = {
                                propertyName: key,
                                oldValue: oldVal,
                                newValue: v
                            };

                            this.trigger('propertyChanging', args);
                            this[privKey] = v;
                            this.trigger('propertyChanged', args);
                        };
                    }
                }

                if (Object.defineProperty) {
                    Object.defineProperty(proto, key, {
                        get: _get,
                        set: _set
                    });
                }
                else if (proto.__defineGetter__ !== undefined) {
                    proto.__defineGetter__(key, _get);
                    proto.__defineSetter__(key, _set);
                }
            };


        $f.property     = property;
        $f.readonly     = readonly;

        $f.typeHandlers.property = handler;
        $f.typeHandlers.readonly = handler;

    }

    properties.info = {
        name: 'properties'
    };

    properties.toString = function toString() {
        return properties.info.name;
    };

    FrameworkFactory.plugins.register(properties);


})(this);
