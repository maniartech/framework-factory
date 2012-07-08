(function (global, undefined) {
    "use strict";

    function is($f, config) {

        var is = {

            //Validation
            func: function func(val) {
                return typeof val === 'function' || val instanceof Function  === true;
            },

            string: function string(val) {
                return typeof val === 'string' || val instanceof String === true;
            },

            number: function num(val) {
                return typeof val === 'number' || val instanceof Number  === true;
            },

            primitive: function primitive(val) {
                return is.string(val) || is.number(val);
            },

            undef: function undef(val) {
                return val === undefined;
            },

            nullOrUndef: function nullOrUndef(val) {
                return val === undefined || val === null;
            },

            date: function date(val) {
                return val instanceof Date === true;
            },

            plainObject: function(val) {
                if (val === undefined || val === null) return false;
                return ((typeof val === 'object') && (val.constructor === Object));
            },

            concreteObject: function(val) {
                return (is.primitive(val) || is.date(val) || is.nullOrUndef(val) || is.array(val)) === false;
            },

            array: function(val) {
                return val instanceof Array;
            },

            inBrowser: function browser() {
                return window !== undefined && global === window;
            }
        };

        $f.is = is;
    }

    is.info = {
        name: 'is'
    };

    is.toString = function toString() {
        return is.info.name;
    }

    FrameworkFactory.plugins.register(is);

})(this);