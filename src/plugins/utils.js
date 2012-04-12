
(function (global, undefined) {
    "use strict";

    function utils($f, config) {

        $f.utils = {

            /**
             * Checks whether both the objects are equals. Iterates through all the
             * members to check equality.
             * @function framework.utils.equals
             * @param o1 The first object
             * @param o2 The second object
             * @returns True if both the objects are equal, false if they are not.
             **/
            equals: function(o1, o2) {

                var key;
                //True if both objects are same.
                if (o1 === o2) {
                    return true;
                }
                for(key in o1) {

                    //If key exists in o1 but not in o2, return false.
                    if (o2[key] === undefined) {
                        return false;
                    }
                    var v1 = o1[key];
                    var v2 = o2[key];

                    //If values in a given key not matches return false.
                    if (v1 !== v2) {
                        return false;
                    }
                }

                //If key exists in o2 but not in o1, returns false.
                for (key in o2) {
                    if (o1[key] === undefined) {
                        return false;
                    }
                }
                //Return true, becuase no differences found.
                return true;

            },

            /**
            * Returns the cloned object created using deep copy algorithm.
            * @param Object that need to be copied.
            * @returns Deep copied object. *
            * @ref: http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
            * @remark:
            *  - Modified to handle circular dependencies.
            *  - May not behave as expected if object consturctor accepts various parameters.
            **/
           deepCopy: function deepCopy(o) {

               //To improve performance, need to replace array with some sort of
               //hash map that accepts objects as key.
               var objRefs = [];

               function doCopy(obj) {

                   var copy, i, iLen, objVal, refIndex,
                       timestamp = new Date() - 0;

                   if (objRefs.indexOf(obj) >= 0) {
                       return objRefs[obj];
                   }
                   else {
                       objRefs.push(obj);
                   }
                   // Handle the 3 simple types, and null or undefined
                   if (null == obj || "object" != typeof obj) return obj;

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
           },

            loadFromJSON: function(o, json, options) {

                options = options || {};
                var setFunctions = options.setFunctions || false;

                for (var key in json) {

                    //Check json object owns the member
                    if (json.hasOwnProperty[key] === false) {
                        continue;
                    }

                    //Check the member exists in object to set.
                    //if (o[key] === undefined) {
                    //    continue;
                    //}

                    //var propMemberType = typeof prop[key];
                    var oMemberType = typeof o[key];
                    var val = json[key];

                    switch (oMemberType) {

                        case 'object': {

                            if (o[key].constructor.loadFromJSON !== undefined) {
                                o[key].constructor.loadFromJSON(o, key, val);
                            }
                            else if (o[key] instanceof Array) {
                                //Push the val to o[key].
                                //o[key].push.apply(o[key], val);
                                o[key] = val;
                            }
                            else {
                                _framework.Utils.loadFromJSON(o[key], val);
                            }
                            break;
                        }
                        case 'function': {
                            if (o[key].loadFromJSON !== undefined) {
                                o[key].loadFromJSON(o, key, val);
                            }
                            else {
                                o[key] = val;
                            }
                            break;
                        }
                        default: {
                            o[key] = val;
                        }
                    }
                }
            },

            exportToJSON: function exportToJSON(o) {
                var json = {};
                for (key in o) {

                }
            },

            //Validation
            isFunction: function(fn) {
                return typeof fn === 'function';
            },

            isNumber: function(num) {
                return typeof num === 'number';
            },

            isUndefined: function(val) {
                return typeof val === 'undefined';
            },

            isString: function(str) {
                return typeof val === 'string';
            },

            isDate: function(dt) {
                return (typeof dt === 'object') &&
                    (dt instanceof Date === true);
            },

            //UUID

            simpleGuid: function(sep) {
                function section() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                }
                return (section()+section()+"-"+section()+"-"+section()+"-"+section()+"-"+section()+section()+section());
            },

            //Empty
            emptyFn: function(){},

            'undefined': undefined

        };

    }

    utils.info = {
        name: 'utils'
    };

    utils.toString = function toString() {
        return utils.info.name;
    };

    FrameworkFactory.plugins.register(utils);


})(this);
