
(function (global, undefined) {
    "use strict";

    function properties($f) {
            
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
                    
            setter = setter || function(v) {
                throw new Error('You are not allowed to write to readonly property "' + key + '".');
            };
        
            if (Object.defineProperty) {
                Object.defineProperty(obj, key, {
                    get: getter,
                    set: setter
                });
            }
            else if (proto.__defineGetter__ !== undefined) {
                proto.__defineGetter__(key, getter);
                proto.__defineSetter__(key, setter);
            }
        }

        /**
         * While defining class, this function sets the member as
         * a property.
         * @param: defaultValue, the default value of property
         * @param: firePropertyChanged, if true,
         * @function
         * @public
         * @version 1.0.0
         **/
        var property = function property(options) {

                var valueOf,
                    value,
                    get, set,
                    readonly,
                    observable = true;

                if (typeof options === 'object') {
                    valueOf = options.valueOf();
                    //Incase of Object based primitive properties like
                    // new String('abc')
                    // new Date('123')
                    if (typeof valueOf !== 'object' && typeof valueOf !== 'function') {
                        //Set primitive
                        value = options.value;
                        get = options.get;
                    }
                    else {
                        //If is object but only getter is found
                        observable  = false;
                        value       = options.value;
                        if (options.get !== undefined && options.set === undefined) {
                            readonly = true;
                            if (arguments[1] === true) {
                                observable = true;
                            }
                        }
                        else if(options.get === undefined && options.set === undefined) {
                            throw new Error('Neither get nor set found in property declaration. This type of object is not currently supported.');
                        }
                        else {
                            get = options.get;
                            set = options.set;
                        }
                    }
                }
                else if (typeof options === 'function') {
                    throw new Error('functions not supported as property default value.');
                }
                else {
                    value = options;
                    if (arguments[1] === true) {
                        observable = true;
                    }
                }

                options = options || {};

                return {
                    type        : 'property',
                    value       : value,
                    readonly    : readonly,
                    observable  : observable || false,
                    get         : options.get,
                    set         : options.set
                };
            },

            /**
             *
             */
            readonly = function readonly(value) {
				var options = {},
				    getter = undefined;
				
				if ($f.is.plainObject(value)) {
					options = value;
					value = (options.value !== undefined)? options.value: undefined;
					if ($f.is.func(options.get)) {
						getter = options.get;
					}
				}
								
                return {
                    type            : 'readonly',
                    value           : value,
                    readonly        : true,
                    observable      : false,
                    get             : getter,
                    set             : undefined
                };
            },

            handler = function (Class, key, options) {

                var proto       = Class.prototype, _get, _set,
                    readonly    = options.readonly,
                    observable = options.observable || false,
                    getter      = options.get,
                    setter      = options.set,
					privKey     = '_' + key,
					value       = options.value;
				
				if (getter !== undefined && setter === undefined) {
                    if (value !== undefined) {
						proto[privKey] = options.value;
					}
                }
				else {
					proto[privKey] = options.value;
				}

                if (proto.propertyChanging === undefined) {

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
				
                if (readonly) {
                    _set = function readonlySet() {
                        throw new Error('You are not allowed to write to readonly property "' + key + '".');
                    };
                }
                else {
                    if (setter !== undefined) {
	                    if (!observable) {
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
	                else {
	
	                    if (!observable) {
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

        $f.attachProperty = attachProperty;
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
