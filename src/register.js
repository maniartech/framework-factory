
    _framework.Register = _framework.Class({
        
        init: function() {
            
            
            
            this._register = {};
            this.keys = [];
        },

        register: function (type, handler) {            
            var register = this._register;
            if (register[key] !== undefined) {
                throw new Error('Key ' + key + ' already registered.');
            }            
            register[type] = handler;
        },

        unregister: function (type) {
            var register = this._register;
            delete register[type];
        },

        get: function (type) {
            var register = this._register;
            return register[type];
        },
        
        set: function(key, type) {
            var register = this._register;
            if (register[type] === undefined) {
                throw new Error('Key not found.')
            }
            register[key] = type;
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