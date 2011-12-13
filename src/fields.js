
    global.$field = function(defaultValue, options) {
        return {
            type: 'framework.field',
            defaultValue: defaultValue,
            options: options
        };
    };

    var fieldHandler = function(Class, key, options) {

        var proto = Class.prototype;
        var __super__ = Class.__super__;
        var privKey = getPrivateKey(key);
        var fieldName = key;
        Class.registerMember(key, options);
        proto[fieldName] = options.defaultValue;
    };

    _framework.TypeHandlers.register("framework.field", fieldHandler);
