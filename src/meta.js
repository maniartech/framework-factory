
    _framework.Meta = {
        keys: function(o) {
            var keys = [];
            for(var key in o) {
                if (o.hasOwnProperty(key) === false) continue;
                keys.push(key);
            }
            return keys;
        },

        functions: function(o) {
            var keys = [];
            for(var key in o) {
                if (o.hasOwnProperty(key) === false) continue;
                if (typeof o[keys] === 'function') keys.push(key);
            }
            return keys;
        },

        stringFields: function(o) {
            var keys = [];
            for(var key in o) {
                if (o.hasOwnProperty(key) === false) continue;
                if (typeof o[keys] === 'string') keys.push(key);
            }
            return keys;
        },

        numberFields: function(o) {
            var keys = [];
            for(var key in o) {
                if (o.hasOwnProperty(key) === false) continue;
                if (typeof o[keys] === 'number') keys.push(key);
            }
            return keys;
        },

    };
