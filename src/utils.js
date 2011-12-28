

    _framework.utils = {

        getPrivateKey: function (key) {
            return _framework.privateMemberPrefix + key;
        },

        getProtectedKey: function(key) {
            return framework.protectedMemberPrifix + key;
        },

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
         *
         **/
        clone: function(o, deep) {
            deep = deep || false;
            throw new Error ('Not implemented error.');
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
                            o[key].constructor.loadFromJSON(o[key], json[key]);
                        }
                        else if (o[key] instanceof Array) {
                            //Push the val to o[key].
                            o[key].push.apply(o[key], val);
                        }
                        else {
                            _framework.Utils.loadFromJSON(o[key], val);
                        }
                        break;
                    }
                    case 'function': {
                        if (setFunctions === true) {
                            o[key] = val;
                        }
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

    
