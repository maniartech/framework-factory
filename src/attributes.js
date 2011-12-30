
    _framework.attribute = function(defaultValue, options) {
        return {
            type: 'framework.attribute',
            defaultValue: defaultValue,
            options: options
        };
    };

    /**
     * Shortcut to framework.attribute method.
     * @see Framework#attribute
     **/
    $f.attr = _framework.attribute;

    var attributeHandler = function(Class, key, options) {

        var proto = Class.prototype;
        var privKey = '_' + key;
        proto[key] = options.defaultValue;
    };

    $f.TypeHandlers["framework.attribute"] = attributeHandler;
