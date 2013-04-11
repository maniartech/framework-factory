(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

    function _attachProperty(obj, key, getter, setter) {

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

    function observable (defaultValue) {
        return {
            type: 'observable',
            defaultValue: defaultValue
        };
    }


    function observables($f) {

        FrameworkFactory.typeHandlers.register({
            type: "observable",
            init: function (Class) {
                var proto = Class.prototype;

                proto._previousVals = {};

                proto.set = function set() {
                    var o = arguments[0],
                        key, changed = {},
                        oldVal, newVal;

                    if (arguments.length === 1 && typeof(o) === "object") {
                        for(key in o) {
                            if (o.hasOwnProperty(key) === true && (this[key] !== o[key])) {
                                oldVal = this[key];
                                newVal = o[key];
                                this._previousVals[key] = oldVal;
                                this[key] = newVal;
                                changed[key] = {
                                    oldValue: oldVal,
                                    newValue: newVal
                                };
                            }
                        }
                    }

                    else if (arguments.length === 2) {
                        key = arguments[0];
                        oldVal = this[key];
                        newVal = arguments[1];

                        if (oldVal !== newVal) {
                            this[key] = newVal;
                            changed[key] = {
                                oldValue: oldVal,
                                newValue: newVal
                            };
                        }
                    }

                    this.onChange(changed);

                    return this;
                };

                proto.onChange = function onChange(changed) {
                    this.trigger("change", {
                        changed: changed
                    });
                    return this;
                };

                Class.attach({
                    change: $f.event()
                });

            },
            handler: function (Class, key, options) {
                var proto = Class.prototype,
                    privateKey = "_" + key,
                    get, set;

                proto[privateKey] = options.value;

                get = function get() {
                    return this[privateKey];
                };

                set = function set(v) {
                    var value = this[privateKey],
                        changed;
                    if (value !== this[privateKey]) {
                        this[privateKey] = v;
                        changed = {};
                        changed[key] = { oldValue: value, newValue: v };
                        this.onChange({ changed: changed });
                    }
                };
                _attachProperty(proto, key, get, set);
            }
        });

    }

    FrameworkFactory.plugins.register(observables);

})(this);