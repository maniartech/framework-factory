
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
                firePropertyChanged: true,
                readonly: false
            };
        },

        silentProperty = function $silentProperty(defaultValue) {
            return {
                type: 'framework.property',
                defaultValue: defaultValue,
                firePropertyChanged: false,
                readonly: false
            };
        },

        readonly = function $readonlyProperty(defaultValue) {
            return {
                type: 'framework.property',
                defaultValue: defaultValue,
                firePropertyChanged: false,
                readonly: true
            };
        },

        propertyHandler = function(classFunction, key, options) {

            var proto = classFunction.prototype;
            var __super__ = classFunction.__super__;
            var privKey = getPrivateKey(key);

            proto[privKey] = options.defaultValue;

            var _get = function() {
                return this[privKey];
            };

            var _set = function(v) {
                var oldVal = this[privKey];
                if (oldVal === v) {
                    return; //Property not changed.
                }

                if (options.firePropertyChanged) {
                    var args = {
                        propertyName: key,
                        oldValue: oldVal,
                        newValue: v
                    };
                    this.propertyChanging.fire(this, args);
                    this[privKey] = v;
                    this.propertyChanged.fire(this, args);
                }
                else {
                    this[privKey] = v;
                }
            };

            if (propertyHandler === PropertyApproach.STANDARD) {

                if (Object.defineProperty) {
                    if (!options.readonly) {
                        Object.defineProperty (proto, key, {
                            get: _get,
                            set: _set
                        });
                    }
                    else {
                       Object.defineProperty (proto, key, {
                            get: _get
                        });
                    }
                }
                else if (proto.__defineGetter__ !== undefined) {
                    proto.__defineGetter__(key, _get);
                    if (!options.readonly) {
                        proto.__defineSetter__(key, _set)
                    }
                }
            }
            else {
                var property = function property(v) {
                    if (v === undefined) {
                        return _get();
                    }
                    else {
                        _set(v);
                    }
                    return this;
                };
                property.isProperty = true;
                property.propertyName = key;
            }

        };

    _framework.TypeHandlers['framework.property'] = propertyHandler;

    //Globals
    global.$property        = property;
    global.$silentProperty  = silentProperty;
    global.$readonly = readonly;

var Shape = $class({

});
