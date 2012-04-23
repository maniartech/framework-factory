(function (global, undefined) {
    "use strict";

    function is($f, config) {

        $f.is = {

            //Validation
            func: function func(val) {
                return typeof val === 'function';
            },

            number: function num(val) {
                return typeof val === 'number';
            },

            undef: function undef(val) {
                return typeof val === 'undefined';
            },

            string: function str(val) {
                return typeof val === 'string';
            },

            date: function date(val) {
                return val instanceof Date === true;
            },

            plainObject: function(val) {
                return ((typeof val === 'object') && (val.constructor === Object));
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