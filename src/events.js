
(function (global, undefined) {
    "use strict";


    function plugin($f) {

        $f.event = function () {
            return {
                type: 'event'
            };
        };

        var eventHandler = function (Class, key) {

            var proto = Class.prototype;

            /**
             * Registers the event for particular event.
             * @example
             * var btn = new Button();
             * btn.mouseMove(function(){
             *  console.log('mouse is moving');
             * });
             **/
            proto[key] = function (handler) {
                this.on(key, handler);
                return this;

				// var privKey = '_' + key;

    //             if (this[privKey] === undefined) {
    //                 this[privKey] = [];
    //             }
    //             this[privKey].push(handler);
    //             return this;
            };

            proto[key].importObject = function (o, k, v) {
                o[k].call(o, v);
            };


            if (proto.on === undefined) {

                /**
                 * Registers the event handler for one or more plugin.
                 * This function is similar to obj.eventName except it accepts more then one plugin.
                 * @example
                 * var btn = new Button();
                 * btn.on('mousemove mouseout mouseup', function() {});
                 **/
                proto.on = function (eventNames, eventHandler) {
                    var names = eventNames.split(' '),
                        i, iLen, eventName,
                        privKey;

                    if (!$f.is.func(eventHandler)) {
                        throw new Error('Only functions can be registered as event handler');
                    }

                    for (i = 0, iLen = names.length; i < iLen; i += 1) {
                        eventName = String.trim(names[i]);

                        privKey = '_' + eventName;
                        if (this[privKey] === undefined) {
                            this[privKey] = [];
                        }
                        this[privKey].push(eventHandler);

                    }
                    return this;
                };

                /**
                 * Triggers an event causes all the hander associated with the event
                 * to be invoked.
                 * @param evantName The name of the event to be triggered.
                 * @param args arguments to be supplied to event handler. The args must be
                 * derived from an Object. This is an optional parameter if it is not supplied
                 * it will be created having a field 'eventName' which will help identify
                 * the name of the event which triggered.
                 **/
                proto.trigger = function (eventName, args) {

                    var s = this['_' + eventName],
                            callback,
                            i;
                    //console.log(eventName, s);
                    if (s === undefined || s.length === 0) {
                        return this; //No need to fire event, sicne there is no subscriber.
                    }
                    args = args || {};
                    args.eventName = eventName;
                    for (i = 0; i < s.length; i += 1) {
                        callback = s[i];
                        if (callback.call(this, args) === false) {
                            //no more firing, if handler returns falses
                            break;
                        }
                    }
                    return this;
                };

                /**
                 * Disassociate the handler from the trigger.
                 **/
                proto.off = function (eventName, handler) {
                    var arr = this['_' + eventName],
                        index;

                    //Specified event not registered so no need to put it off.
                    if (arr === undefined) {
                        return;
                    }

                    index = arr.indexOf(handler);
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                    return this;
                };

            }
        };

        $f.typeHandlers.event = eventHandler;

    }

    plugin.info = {
        name: 'plugin'
    };

    plugin.toString = function () {
        return plugin.info.name;
    };

    global.FrameworkFactory.plugins.register(plugin);

})(this);
