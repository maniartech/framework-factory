(function (root, undefined) {
    "use strict";

    var FrameworkFactory = root.FrameworkFactory;

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
             * Checks whether given value is a string or not.
             * @function
             * @param {anything} val The val to be checked for string test.
             * @returns {boolean} ``true`` if parameter val is a valid string, else ``false``.
             * @public
             * @version 1.0
             **/
            string: function string(val) {
                return typeof val === 'string' || val instanceof String === true;
            },

            /**
             * Checks whether given value is a number or not.
             * @function
             * @param {anything} val The val to be checked for number test.
             * @returns {boolean} ``true`` if parameter val is a valid number, else ``false``.
             * @public
             * @version 1.0
             **/
            number: function number(val) {
                return typeof val === 'number' || val instanceof Number  === true;
            },

            /**
             * Checks whether given value is a primitive or not.
             * @function
             * @param {anything} val The val to be checked for primitive test.
             * @returns {boolean} ``true`` if parameter val is a valid primitive, else ``false``.
             * @public
             * @version 1.0
             **/
            primitive: function primitive(val) {
                return _is.string(val) || _is.number(val);
            },

            /**
             * Checks whether specified value is undefined or not.
             * @function undef
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for undefined test.
             * @returns {boolean} ``true`` if parameter val is a valid undefined, else ``false``.
             * @public
             * @version 1.0
             **/
            undef: function undef(val) {
                return val === undefined;
            },

            /**
             * Checks whether specified value is either null or undefined.
             * @function nullOrUndef
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for null and undefined test.
             * @returns {boolean} ``true`` if parameter val is a either null or undefined, else ``false``.
             * @public
             * @version 1.0
             **/
            nullOrUndef: function nullOrUndef(val) {
                return val === undefined || val === null;
            },

            /**
             * Checks whether specified value is date or not.
             * @function date
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for date test.
             * @returns {boolean} ``true`` if parameter val is a valid date, else ``false``.
             * @public
             * @version 1.0
             **/
            date: function date(val) {
                return val instanceof Date === true;
            },

            /**
             * Checks whether specified value is regular expression or not.
             * @function regExp
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for regular expression test.
             * @returns {boolean} ``true`` if parameter val is a valid regular expression, else ``false``.
             * @public
             * @version 1.0
             **/
            regExp: function regExp(val) {
                return val instanceof RegExp === true;
            },

            /**
             * Checks whether specified value is undefined or not.
             * @function undef
             * @module <future-framework>.is
             * @param {anything} val The val to be checked for undefined test.
             * @returns {boolean} ``true`` if parameter val is a valid undefined, else ``false``.
             * @public
             * @version 1.0
             **/
            plainObject: function (val) {
                if (val === undefined || val === null) { return false; }
                return ((typeof val === 'object') && (val.constructor === Object));
            },

            concreteObject: function (val) {
                return (_is.primitive(val) || _is.date(val) || _is.regExp(val) || _is.nullOrUndef(val) || _is.array(val)) === false;
            },

            array: function (val) {
                return val instanceof Array;
            },

            inBrowser: function browser() {
                return window !== undefined && root === window;
            }
        };

        $f.is = _is;
    }

    plugin.info = {
        name: 'is'
    };

    FrameworkFactory.plugins.register(plugin);

})(this);