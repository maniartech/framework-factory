

var ArgumentParser = $class({

    init: function (args) {
        this.args = args;
    },

    get: function (value, defaultValue, castFn) {
        if (value === undefined) {
            return defaultValue;
        }
        if (castFn !== undefined) {
            return castFn(value);
        }
        return value;
    },

    index: function (i, defaultValue, castFn) {
        var args = this.args,
            val = args[i];

        if (val === undefined) {
            return defaultValue;
        }
        return val;
    },

    check: function(value, argumentName, castFn) {
        if (value === undefined) {
            throw Error('Argument ' + argumentName + ' not supplied.');
        }
        if (castFn !== undefined) {
            return castFn(value);
        }
        return value;
    },

    checkIndex: function (i, argumentName, castFn) {
        var args = this.args,
            val = args[i];

        if (val === undefined) {
            throw Error('Argument ' + argumentName + ' not supplied.');
        }
        return val;
    },



});

function test(name, abc, xyz) {

    var args = new ArgumentParser(arguments),
        n = args.check(name, "name");
}
