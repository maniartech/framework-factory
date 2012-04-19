
(function (global, undefined) {
    "use strict";

    function classes($f, config) {

        var initializing = true,
            fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            Class;

        Class = function (prop, parent) {
            //Checks if _super exists in overriden function, inspired by John Resig.
            var hasProp = Object.prototype.hasOwnProperty,
                proto, key, Class, __super__, funcString;

            if (config.defaultBaseClass !== undefined) {
                //It is a base class
                if (prop.type === config.defaultBaseClass) {
                    parent = Object;
                }
                else {
                    parent  = parent || $f[config.defaultBaseClass];
                }
            }
            else {
                parent = parent || Object;
            }
            prop    = prop || {};

            //prevents call to
            initializing = true;
            proto = new parent;
            initializing = false;

            //TODO: Validate & execute prop.type
            if (prop.type === undefined || typeof prop.type !== 'string') {
                Class = function Class() {
                    if (!(this instanceof Class)) {
                        throw new Error('Class used as function.');
                    }
                    //this.constructor = Class;
                    if (initializing === false && this.init !== undefined) {
                        this.init.apply(this, arguments);
                    }
                };
            }
            else {
                funcString = "Class = function " + prop.type + "() { \
                    if (!(this instanceof Class)) { \
                        throw new Error('Class used as function.'); \
                    } \
                    if (initializing === false && this.init !== undefined) { \
                        this.init.apply(this, arguments); \
                    } \
                }";
                Class = eval(funcString);
            }

            //for each static members in parents, copy'em to child
            for (key in parent) {
                //if parent owns the key, set child item = parent item
                if (hasProp.call(parent, key)) {
                    Class[key] = parent[key];
                }
            }

            __super__ = parent.prototype;

            Class.prototype = proto;
            Class.prototype.constructor = Class;
            Class.__super__ = __super__;

            Class.attach = function attach(prop) {

                var item, type, val, processed,
                    typeHandler;

                for (key in prop) {

                    if (!hasProp.call(prop, key)) {
                        continue;
                    }

                    item = prop[key];
                    type = typeof item;
                    val = item;
                    processed = false;

                    if (type === 'object' && item.type !== undefined) {
                        typeHandler = $f.typeHandlers[item.type];
                        if (typeHandler !== undefined) {
                            typeHandler(Class, key, item);
                            processed = true;
                        }
                    }
                    else if (type === 'function' &&
                            typeof __super__[key] === 'function' &&
                            fnTest.test(item)) {
                        proto[key] = (function (key, fn) {
                            return function () {
                                this.base =  function () {
                                    __super__[key].apply(this, arguments);
                                };
                                var ret = fn.apply(this, arguments);
                                delete this.base;
                                return ret;
                            };
                        })(key, item);
                        processed = true;
                    }

                    //console.log([key, type == 'function', typeof __super__[key], fnTest.test(item)]);

                    if (!processed) {
                        proto[key] = val;
                    }
                    Class.__meta__[key] = item;
                }
            };

            Class.__meta__ = {};

            Class.attach(prop);

            //return
            return Class;

        };

        if (config.defaultBaseClass !== undefined) {

            $f[config.defaultBaseClass] = Class({
                type: config.defaultBaseClass
            });
        }

        $f.Class = Class;

    };

    classes.toString = function() {
        return "classes";
    }

    classes.info = {
        name: 'classes'
    };

    FrameworkFactory.plugins.register(classes);


})(this);