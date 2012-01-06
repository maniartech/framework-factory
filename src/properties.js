
    (function($f, global, undefined) {

        /*
        * @function: $property
        * @description: While defining class, this function sets the member as
        * a property.
        * @param: defaultValue, the default value of property
        * @param: firePropertyChanged, if true,
        * */
        var property = function property(defaultValue, options) {

            options = options || {};
            return {
                type: 'framework.property',
                defaultValue: defaultValue,
                readonly: false,
                silent: options.silent || false,
                get: options.get,
                set: options.set
            };
        },

            readonly = function readonly(defaultValue, options) {
                options = options || {};
                return {
                    type: 'framework.readonly',
                    defaultValue: defaultValue,
                    readonly: true,
                    silent: false,
                    get: options.get
                };
            },

            handler = function(Class, key, options) {

                var proto = Class.prototype, _get, _set,
                    readonly = options.readonly,
                    silent = options.silent,
                    getter = options.get,
                    setter = options.set,
                    privKey = '_' + key;

                proto[privKey] = options.defaultValue;
                var silent = options.silent || false;

                if (readonly === false && silent === false) {
                    //Attach property change events to the proto of the Class
                    if (proto['propertyChanged'] === undefined) {
                        Class.attach({
                            propertyChanging: $f.event(),
                            propertyChanged : $f.event()
                        });
                    }
                }

                //console.log('In set', setter);



                _get = getter || function get () {
                    return this[privKey];
                };

                if (setter !== undefined) {
                    if (silent) {
                        _set = setter;
                    }
                    else {
                        _set = function(v) {
                            var oldVal = this[key];
                            if (oldVal === v) {
                                return; //property not changed.
                            }

                            var args = {
                                propertyName: key,
                                oldValue: oldVal,
                                newValue: v
                            };
                            this.trigger('propertyChanging', args);
                            setter.call(this, v);
                            this.trigger('propertyChanged', args);
                        }
                    }
                }
                else if(readonly === true) {
                    _set = function readonlySet() {
                        throw new Error('You are not allowed to write to readonly attribute "' + key + '".');
                    };
                }
                else {
                    if (silent) {
                        _set = function(v) {
                            this[privKey] = v;
                        }
                    }
                    else {
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
                        };
                    }
                }

                if (Object.defineProperty) {
                    Object.defineProperty (proto, key, {
                        get: _get,
                        set: _set
                    });
                }
                else if (proto.__defineGetter__ !== undefined) {
                    proto.__defineGetter__(key, _get);
                    proto.__defineSetter__(key, _set);
                }
            };

        $f.TypeHandlers['framework.property'] = handler;
        $f.TypeHandlers['framework.readonly'] = handler;

        $f.property     = property;
        $f.readonly     = readonly;

    })(_framework, global);
