
    (function($f, global, undefined) {

        $f.event = function() {
            return {
                type: 'framework.event'
            };
        };

        var eventHandler = function(Class, key, options) {

            var proto = Class.prototype;
            //var eventName = key;


            /**
             * Registers the event for particular event.
             * @example
             * var btn = new Button();
             * btn.mouseMove(function(){
             *  console.log('mouse is moving');
             * });
             **/
            proto[key] = function (handler) {
                var privKey = '_' + key;
                if (this[privKey] === undefined) {
                    this[privKey] = [];
                }
                this[privKey].push(handler);
            };

            proto[key].loadFromJSON = function(o, k, v) {
                o[k].call(o, v);
            };


            if (proto.on === undefined) {

                /**
                 * Registers the event handler for one or more events.
                 * This function is similar to obj.eventName except it accepts more then one events.
                 * @example
                 * var btn = new Button();
                 * btn.on('mousemove, mouseout, mouseup', function() {});
                 **/
                proto.on = function(eventNames, eventHandler) {
                    var names = eventNames.split(' ');
                    for(var i=0, length=names.length; i<length; i++) {
                        var eventName = String.trim(names[i]);
                        if (this[eventName] !== undefined) {
                            //Event found, now register handler
                            this[eventName](eventHandler);
                        }
                    }
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
                proto.trigger = function(eventName, args) {

                    var s = this['_' + eventName];
                    //console.log(eventName, s);
                    if (s === undefined || s.length === 0) {
                        return this; //No need to fire event, sicne there is no subscriber.
                    }
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

                /**
                 * Disassociate the handler from the trigger.
                 **/
                proto.off = function(eventName, handler) {
                    var arr = this['_' + eventName];
                    var index = arr.indexOf(handler);
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                };

            }
        };

        $f.TypeHandlers["framework.event"] = eventHandler;

    })(_framework, global);
