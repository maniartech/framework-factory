(function (root, undefined) {
    "use strict";

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

    function observable (value, meta) {
        meta = meta || {};
        meta.default = value;

        return {
            type: 'observable',
            value: value,
            meta: meta
        };
    }


    // TODO: Move obbservable to optional plugins
    function observables($f) {

        $f.observable = observable;

        FrameworkFactory.typeHandlers.register({
            type: "observable",
            setup: function (Class) {
                var proto = Class.prototype;

                proto.set = function set() {
                    var o = arguments[0],
                        key, privateKey, changed = {},
                        oldVal, newVal;

                    if (arguments.length === 1 && typeof(o) === "object") {
                        for(key in o) {
                            if (o.hasOwnProperty(key) === true && (this[key] !== o[key])) {
                                privateKey = "_" + key;
                                oldVal = this[key];
                                newVal = o[key];
                                this[privateKey] = newVal;
                                changed[key] = {
                                    oldValue: oldVal,
                                    newValue: newVal
                                };
                            }
                        }
                    }

                    else if (arguments.length === 2) {
                        key = arguments[0];
                        privateKey = "_" + key;
                        oldVal = this[key];
                        newVal = arguments[1];

                        if (oldVal !== newVal) {
                            this[privateKey] = newVal;
                            changed[key] = {
                                oldValue: oldVal,
                                newValue: newVal
                            };
                        }
                    }

                    this.onChange(changed);
                    return this;
                };

                // TODO: Do not trigger "change" event when values change,
                // onChange should be sufficient.
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

                    if (value !== v) {
                        this[privateKey] = v;
                        changed = {};
                        changed[key] = { oldValue: value, newValue: v };
                        this.onChange(changed);
                    }
                };
                _attachProperty(proto, key, get, set);
            }
        });

    }

    FrameworkFactory.plugins.register({
        name: "observables",
        load: observables
    });

})(this);