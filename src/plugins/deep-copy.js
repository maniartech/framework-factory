(function (global, undefined) {
    "use strict";

    var FrameworkFactory = global.FrameworkFactory;

    function plugin($f) {

        /**
         * Returns the cloned object created using deep copy algorithm.
         * @param o Object or anything that need to be cloned.
         * @returns The cloned object.
         * @ref: http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
         * @thanks A. Levy
         * @remark:
         *  - Modified to handle circular dependencies.
         *  - May not behave as expected if object consturctor accepts various parameters.
         **/
        $f.clone = function clone(o) {
            //To improve performance, need to replace array with some sort of
            //hash map that accepts objects as key.
            var objRefs = [];

            function doCopy(obj) {

                var copy, i, iLen;

                if (objRefs.indexOf(obj) >= 0) {
                     //Object found, return the same object no need to copy it.
                    return obj;
                }
                else {
                    objRefs.push(obj);
                }
                // Handle the 3 simple types, and null or undefined
                if (null === obj || "object" !== typeof obj) {
                    return obj;
                }

                // Handle Date
                if (obj instanceof Date) {
                    copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }

                // Handle Array
                if (obj instanceof Array) {
                    copy = [];
                    for (i = 0, iLen = obj.length; i < iLen; i += 1) {
                        copy[i] = doCopy(obj[i]);
                    }
                    return copy;
                }

                // Handle Object
                if (obj instanceof Object) {
                    copy = new obj.constructor();
                    for (var attr in obj) {
                        if (obj.hasOwnProperty(attr) === true) {
                            copy[attr] = doCopy(obj[attr]);
                        }
                    }
                    return copy;
                }
                throw new Error("Unable to copy obj! Its type isn't supported.");
            }
            return doCopy(o);
        };
    }

    plugin.info = {
        name: "clone",
        author: "Mohamed Aamir Maniar",
        version: "1.0"
    };

    plugin.toString = function toString() {
        return plugin.info.name;
    };

    FrameworkFactory.plugins.register(plugin);


})(this);