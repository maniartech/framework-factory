
(function (root, undefined) {
    "use strict";

    function events($f) {

        $f.event = function (meta) {
            return {
                type: 'event',
                meta: meta || {}
            };
        };

        FrameworkFactory.typeHandlers.register({
            type: "event",
            setup: function(Class) {
                var proto = Class.prototype,
                    subscribedEventKeys = {},
                    subscribedEvents = [];

                /**
                 * Registers the event handler for one or more plugin.
                 * This function is similar to obj.eventName except it accepts more then one plugin.
                 * @example
                 * var btn = new Button();
                 * btn.on('mousemove mouseout mouseup', function() {});
                 **/
                proto.on = function on (eventNames, eventHandler) {
                    //Conver the event names to lower case.
                    var names = eventNames.toLowerCase().split(' '),
                        i, iLen, eventName,
                        privKey,
                        events;

                    events = this._events = this._events || {
                        _names: []
                    };

                    if (!$f.is.func(eventHandler)) {
                        throw new Error('Invalid handler!');
                    }

                    for (i = 0, iLen = names.length; i < iLen; i += 1) {
                        eventName = names[i].trim();

                        if (events[eventName] === undefined) {
                            events[eventName] = []
                            events['_names'].push(eventName);
                        }
                        events[eventName].push(eventHandler);
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
                proto.trigger = function trigger (eventName, args, context) {

                    var subscribers,
                        callback;

                    eventName = eventName.toLowerCase();
                    subscribers = this._events[eventName];

                    if (subscribers === undefined || subscribers.length === 0) {
                        return this; //No need to fire event, sicne there is no subscriber.
                    }

                    args = args || {};
                    args.eventName = eventName;
                    for (i = 0; i < subscribers.length; i += 1) {
                        callback = subscribers[i];
                        //TODO: Context unit-test pending
                        if (callback.call(context || this, args) === false) {
                            //no more firing, if handler returns false.
                            break;
                        }
                    }
                    return this;
                };

                /**
                 * Disassociate the handler from the trigger.
                 **/
                proto.off = function off(eventName, handler) {
                    var subscribers,
                        index;

                    eventName = eventName.toLowerCase();
                    subscribers = this._events[eventName];


                    //Specified event not registered so no need to put it off.
                    if (subscribers === undefined) {
                        return this;
                    }

                    //If handler is not provided, remove all subscribers
                    if (handler === undefined) {
                        subscribers.length = 0;
                    }
                    else {
                        index = subscribers.indexOf(handler);
                        if (index !== -1) {
                            subscribers.splice(index, 1);
                        }
                    }

                    // Update subscribedEvents and subscribedEventKeys
                    if (subscribers.length == 0) {
                        index = this._events._names.indexOf(eventName);
                        if (index != -1) {
                            this._events._names.splice(index, 1);
                        }
                        delete this._events[eventName];
                    }

                    if (this._events._names.length === 0) {
                        delete this._events;
                    }


                    return this;
                };

                /**
                 * Unsubscribe all the events from all the subscribers. Use this method to clean up
                 * or detatch event handlers from the object.
                 *
                 * @function $f.Class.unsubscribeAll()
                 * @return {Object} The current object.
                 *
                 * @public
                 **/
                proto.unsubscribeAll = function unsubscribeAll() {
                    var events = this._events._names;

                    while(events.length > 0) {
                        this.off(events[0]);
                    }
                    return this;
                };

                /**
                 *
                 */
                proto.subscribers = function subscribers(eventName) {
                    if (this._events) {
                        return this._events[eventName.toLowerCase()] || [];
                    }
                    return [];
                };
            },

            handler: function handler(Class, key) {

                var proto = Class.prototype;

                /**
                 * Registers the event for particular event.
                 * @function
                 * @param {function} handler The handler function which should be invoked on event.
                 * @returns The current object.
                 * @example=
                 * var btn = new Button();
                 * btn.mouseMove(function(){
                 *     console.log('mouse is moving');
                 * });
                 **/
                proto[key] = function (eventHandler) {
                    this.on(key, eventHandler);
                    return this;
                };

                proto[key].event = true;
            }
        });

    }

    FrameworkFactory.plugins.register({
        name: 'events',
        load: events
    });

})(this);
