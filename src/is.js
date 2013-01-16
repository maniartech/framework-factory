(function (global, undefined) {
    "use strict";

    function plugin($f) {

        var _is = {

            //Validation
            /**
             * Checks whether given value is a function or not.
             * @function
             * @param {anything} val The val to be checked for function test.
             * @returns {boolean} ``true`` if parameter val is a valid function, else ``false``.
             * @public
             * @version 1.0
             **/
            func: function func(val) {
                return typeof val === 'function' || val instanceof Function  === true;
            },

            /**
             * Checks whether given value is a number or not.
             * @function
             * @param {anything} val The val to be checked for number test.
             * @returns {boolean} ``true`` if parameter val is a valid number, else ``false``.
             * @public
             * @version 1.0
             **/
            string: function string(val) {
                return typeof val === 'string' || val instanceof String === true;
            },

            number: function num(val) {
                return typeof val === 'number' || val instanceof Number  === true;
            },

            primitive: function primitive(val) {
                return _is.string(val) || _is.number(val);
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

            plainObject: function (val) {
                if (val === undefined || val === null) { return false; }
                return ((typeof val === 'object') && (val.constructor === Object));
            },

            concreteObject: function (val) {
                return (_is.primitive(val) || _is.date(val) || _is.nullOrUndef(val) || _is.array(val)) === false;
            },

            array: function (val) {
                return val instanceof Array;
            },

            inBrowser: function browser() {
                return window !== undefined && global === window;
            }
        };

        $f.is = _is;
    }

    plugin.info = {
        name: 'is'
    };

    plugin.toString = function toString() {
        return plugin.info.name;
    };

    global.FrameworkFactory.plugins.register(plugin);

})(this);