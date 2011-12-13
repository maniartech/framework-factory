
    _framework.Register = _framework.Class({

        register: function (type, handler) {
            if (this[type] !== undefined) {
                throw new Error('TypeHandler ' + type + ' already registered.');
            }
            this[type] = handler;
        },

        unregister: function (type) {
            delete this[type];
        },

        get: function (type) {
            return this[type];
        }

    }, Object);

    _framework.TypeHandlers = new _framework.Register();

    /*
     * @function Registers a new type handler.
     * @param The the which need to be registered.
     * @param Handler for the specified type.
     * */
    FrameworkFactory.registerTypeHandler = function(type, handler) {
        _framework.TypeHandlers.register(type, Handler);
    };