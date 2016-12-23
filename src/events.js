
(function (root, undefined) {
    "use strict";

    function events($f) {

        $f.event = function (config) {
            return {
                type: 'event',
                config: config
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
                        privKey;

                    if (!$f.is.func(eventHandler)) {
                        throw new Error('Invalid handler!');
                    }

                    for (i = 0, iLen = names.length; i < iLen; i += 1) {
                        eventName = trim(names[i]);

                        privKey = '_' + eventName;
                        if (this[privKey] === undefined) {
                            this[privKey] = [];
                        }
                        this[privKey].push(eventHandler);

                        if (subscribedEventKeys[eventName] === undefined) {
                            subscribedEvents.push(eventName);
                            subscribedEventKeys[eventName] = true;
                        }
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
                proto.trigger = function trigger (eventName, args) {

                    var subscribers = this['_' + eventName.toLowerCase()],
                            callback,
                            i;
                    if (subscribers === undefined || subscribers.length === 0) {
                        return this; //No need to fire event, sicne there is no subscriber.
                    }
                    args = args || {};
                    args.eventName = eventName;
                    for (i = 0; i < subscribers.length; i += 1) {
                        callback = subscribers[i];
                        if (callback.call(this, args) === false) {
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
                    var subscribers = this['_' + eventName.toLowerCase()],
                        index;

                    //Specified event not registered so no need to put it off.
                    if (subscribers === undefined) {
                        return;
                    }

                    //If handler is not provided, remove all subscribers
                    if (handler === undefined) {
                        subscribers.length = 0;
                        return this;
                    }

                    index = subscribers.indexOf(handler);
                    if (index !== -1) {
                        subscribers.splice(index, 1);
                        //TODO: Update subscribedEvents and subscribedEventKeys
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
                    var events = subscribedEvents,
                        i, iLen = events.length;

                    for(i=0; i < iLen; i += 1) {
                        this.off(events[i]);
                    }
                    return this;
                };

                /**
                 *
                 */
                proto.subscribers = function subscribers(eventName) {
                    var eventSubscribers = this['_' + eventName.toLowerCase()];
                    return (eventSubscribers) ? eventSubscribers.slice() : [];
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

    FrameworkFactory.plugins.register(events);

})(this);
