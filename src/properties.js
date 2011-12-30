
    (function($f, global, undefined) {

        /*
        * @function: $property
        * @description: While defining class, this function sets the member as
        * a property.
        * @param: defaultValue, the default value of property
        * @param: firePropertyChanged, if true,
        * */
        var property = function property(defaultValue) {
                return {
                    type: 'framework.property',
                    defaultValue: defaultValue,
                    readonly: false
                };
            },

            readonly = function readonly(defaultValue) {
                return {
                    type: 'framework.readonly',
                    defaultValue: defaultValue,
                    readonly: true
                };
            },

            handler = function(Class, key, options) {

                var proto = Class.prototype,
                    privKey = '_' + key;

                proto[privKey] = options.defaultValue;

                if (options.readonly == false) {

                    //Attach property change events to the proto of the Class
                    if (proto['propertyChanged'] === undefined) {
                        Class.attach({
                            propertyChanging: $f.event(),
                            propertyChanged : $f.event()
                        });
                    }
                }

                var _get = function get () {
                        return this[privKey];
                    },
                    _set = function set (v) {

                        var oldVal = this[privKey];

                        if (oldVal === v) {
                            return; //Property not changed.
                        }

                        var args = {
                            propertyName: key,
                            oldValue: oldVal,
                            newValue: v
                        };
                        this.trigger('propertyChanging', args);
                        this[privKey] = v;
                        this.trigger('propertyChanged', args);

                    },
                    _readonlySet = function readonlySet() {
                        throw new Error('You are not allowed to write to readonly attribute "' + key + '".');
                    };

                if (Object.defineProperty) {
                    if (!options.readonly) {
                        Object.defineProperty (proto, key, {
                            get: _get,
                            set: _set
                        });
                    }
                    else {
                       Object.defineProperty (proto, key, {
                            get: _get,
                            set: _readonlySet
                        });
                    }
                }
                else if (proto.__defineGetter__ !== undefined) {
                    proto.__defineGetter__(key, _get);
                    proto.__defineSetter__(key, _readonlySet);
                }
            };

        $f.TypeHandlers['framework.property'] = handler;
        $f.TypeHandlers['framework.readonly'] = handler;

        $f.property     = property;
        $f.readonly     = readonly;

    })(_framework, global);
