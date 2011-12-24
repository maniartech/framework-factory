
    $f.event = function() {
        return {
            type: 'framework.event'
        }
    };

    var eventHandler = function(Class, key, options) {

        var proto = Class.prototype;
        var __super__ = Class.__super__;
        var privKey = $f.utils.getPrivateKey(key);
        //var eventName = key;

        var eventFn;

        var eventFn = function eventFn(handler) {

            if (this[privKey] === undefined) {
                this[privKey] = [];
            }
            this[privKey].push(handler);
        };

        proto[key] = eventFn;

        //Handle Prototypes
        if (proto['on'] === undefined) {
            proto.on = function(eventNames, eventHandler) {
                var names = eventNames.split(',');
                for(var i=0, length=names.length; i<length; i++) {
                    var eventName = String.trim(names[i]);
                    if (this[eventName] !== undefined) {
                        //Event found, now register handler
                        this[eventName](eventHandler);
                    }
                }
            };

            proto.trigger = function(eventName, args) {
                var s = this[privKey];
                args = args || {};
                args["eventName"] = eventName;
                for(var i=0, len=s.length; i<len ; i++) {
                    var ret = s[i](this, args);
                    if (ret === false) {
                        //no more firing, if handler returns falses
                        break;
                    }
                }
                return this;
            };

            proto.off = function(eventName, handler) {
                var arr = this[$f.utils.getPrivateKey(eventName)];
                var index = arr.indexOf(handler);
                if (index !== -1) {
                    arr.splice(index, 1);
                }
            };

        }
    };

    $f.TypeHandlers["framework.event"] = eventHandler;
