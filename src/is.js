(function (global, undefined) {
    "use strict";

    function is($f, config) {

        $f.is = {

            //Validation
            /**
             * Checks whether given value is a function or not.
             * @function
             * @param {anything} val The val to be checked for function test.
             * @returns {boolean} ``true`` if parameter val is a valid function, else ``false``.
             * @public
             * @
             **/
            func: function func(val) {
                return typeof val === 'function' || val instanceof Function  === true;
            },

            number: function num(val) {
                return typeof val === 'number' || val instanceof Number  === true;
            },

            undef: function undef(val) {
                return val === undefined;
            },

            nullOrUndef: function nullOrUndef(val) {
                return val === undefined || val === null;
            },

            string: function string(val) {
                return typeof val === 'string' || val instanceof String === true;
            },

            date: function date(val) {
                return val instanceof Date === true;
            },

            plainObject: function(val) {
                if (val === undefined || val === null) return false;
                return ((typeof val === 'object') && (val.constructor === Object));
            },

            array: function(val) {
                return val instanceof Array;
            },

            inBrowser: function browser() {
                return window !== undefined && global === window;
            }
        };
    }

    is.info = {
        name: 'is'
    };

    is.toString = function toString() {
        return is.info.name;
    }

    FrameworkFactory.plugins.register(is);

})(this);