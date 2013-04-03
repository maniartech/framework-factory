
test ('Event Tests', function(){

    var btn = new Button("Button1");

    eq (typeof btn.click, 'function', 'Check event attached');

    var obj, args, val, eventRaised, errors = 0;

    function handler1(a) {
        obj = this;
        args = a;
        val = a.val;
        btn.clickCount++;
        eventRaised = a.eventName;
    }

    function handler2 () {
        btn.clickCount++;
        //console.log(btn.clickCount)
    }

    btn.click(handler1);
    eq (btn.event("click").length, 1, "Event subsriber count check");
    btn.trigger('click', {
        val: 100
    });

    eq (typeof btn.trigger, 'function', 'Check trigger attached');

    eq (obj, btn, "this in event handler must the object which fired the event.");
    neq (args, null, "Event args can not be null.");
    eq (typeof args, 'object', "Supplied args must be of type object.");
    eq (args.val, 100, "Event handler must receive the values supplied.");
    eq (val, 100, "Event handler must receive the values supplied.");
    eq (btn.clickCount, 1, "Event fired once and received once so click count 1");
    eq (eventRaised, 'click', 'Event args should contain the name of event which triggered.');
    btn.click(handler2);

    btn.trigger('click', { val: 100 });

    eq (btn.event("click").length, 2, "Event subsriber count check");

    eq (btn.clickCount, 3, "Event handler must have first argument the object on which event fired.");

    btn.off('click', handler2);

    eq (btn.event("click").length, 1, "Event subsriber count check");

    btn.trigger('click', { val: 200 });

    eq (btn.clickCount, 4, "Event handler must have first argument the object on which event fired.");

    var btn2 = new Button("Button2");
    btn2.click(handler1);
    btn2.click(handler2);

    eq (btn.event("click").length, 1, "Event subsriber count check for button1");
    eq (btn2.event("click").length, 2, "Event subsriber count check for button2");
    //alert([btn.click.count(), btn2.click.count()]);

    btn2.off('click', handler1);
    btn2.off('click', handler2);

    eq (btn2.event("click").length, 0, "Event subsriber count check for button2");

    btn2.on('click mouseMove', handler1);

    eq (btn2.event("click").length, 1, "Event subsriber count check for button2");
    eq (btn2.event("mouseMove").length, 1, "Event subsriber count check for button2");

    try {
        btn.click(true);
    }
    catch(error) {
        eq(error.message, 'Only functions can be registered as event handler');
        errors += 1;
    }
    eq(errors, 1, "Value other then function can't be set as event handler.");
});