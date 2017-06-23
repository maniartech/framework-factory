module("events");

test ('Event Tests', function() {

    var emp1 = new membership.Employee("john"),
        emp2 = new membership.Employee("jathanna"),
        startCount = 0,
        stopCount = 0,
        lastEventArgs,
        lastObj;

    //Check whether $f.event typehandler properly attached.
    eq (typeof membership.event, "function", "Check event function attached to membership framework.");
    eq (typeof membership.event(), "object");
    eq (membership.event().typeHandler, "events");

    //Check event functions properly attached.
    eq (typeof emp1.trigger, "function");
    eq (typeof emp1.on, "function");
    eq (typeof emp1.off, "function");
    eq (typeof emp1.subscribers, "function");

    eq (typeof emp2.trigger, "function");
    eq (typeof emp2.on, "function");
    eq (typeof emp2.off, "function");
    eq (typeof emp2.subscribers, "function");

    eq (typeof emp1.start, "function", "Check event attached");
    eq (typeof emp1.stop, "function", "Check event attached");
    eq (typeof emp2.start, "function", "Check event attached");
    eq (typeof emp2.stop, "function", "Check event attached");

    function start(e) {
        startCount += 1;
        lastEventArgs = e;
        lastObj = this;
    }

    function start2(e) {
        startCount += 1;
        lastEventArgs = e;
        lastObj = this;
    }

    function stop(e) {
        stopCount += 1;
        lastEventArgs = e;
        lastObj = this;
    }

    emp1.start(start);
    emp1.startWork("process");

    eq(emp1.subscribers("start").length, 1);
    eq(startCount, 1);
    neq(lastEventArgs, undefined);
    eq(lastEventArgs.work, "process");
    eq(lastEventArgs.eventName, "start");

    eq(lastObj, emp1, "Callback should be called under the context of firing object");

    emp1.on("start coolstart", start2);
    eq(emp1.subscribers("start").length, 2);
    eq(emp1.subscribers("coolstart").length, 1);

    emp1.trigger("start");
    eq(startCount, 3);

    emp1.trigger("coolstart");
    eq(startCount, 4);
    neq(lastEventArgs, undefined);
    eq(lastEventArgs.eventName, "coolstart");

    emp2.start(start2);
    eq(emp2.subscribers("start").length, 1);
    eq(emp2._coolstart, undefined);

    emp1.off("start", start2);
    eq(emp1.subscribers("start").length, 1);

    emp1.on("start", start2);
    eq(emp1.subscribers("start").length, 2);

    emp1.off("start");
    eq(emp1.subscribers("start").length, 0);

    emp1.on("start", start);
    emp1.on("start", start2);
    eq(emp1.subscribers("start").length, 2);

    emp1.unsubscribeAll();
    eq(emp1.subscribers("start").length, 0);
    eq(emp1._events, undefined);

    eq(emp2.subscribers("start").length, 1);

    emp2.unsubscribeAll();
    eq(emp2.subscribers("start").length, 0);
    eq(emp2._events, undefined);

    raises(function () {
        emp1.on("wow", false);
    }, "Only functions can be registered as event handler");

    raises(function () {
        emp1.start(false);
    }, "Only functions can be registered as event handler");


});
