module("observables");

test ('observable', function() {

    var observable = new components.ObservableClass(10),
        changeCount = 0,
        lastEventArg;

    eq(typeof components.observable, "function");
    eq(components.observable(10).type, "observable");
    eq(components.observable(10).value, 10);

    eq(observable.name, "buddy");
    eq(observable.age, 30);
    eq(typeof observable.change, "function");

    observable.change(function(e) {
        lastEventArg = e;
        changeCount += 1;
    });

    observable.name = "guy";

    eq(observable.name, "guy");
    eq(changeCount, 1);
    eq(typeof lastEventArg.changed, "object");
    eq("name" in lastEventArg.changed, true);
    eq("age" in lastEventArg.changed, false);

    observable.age = 50;

    eq(observable.age, 50);
    eq(changeCount, 2);
    eq(typeof lastEventArg.changed, "object");
    eq("name" in lastEventArg.changed, false);
    eq("age" in lastEventArg.changed, true);

    observable.set("name", "buddy");

    eq(observable.name, "buddy");
    eq(changeCount, 3);
    eq(typeof lastEventArg.changed, "object");
    eq("name" in lastEventArg.changed, true);
    eq("age" in lastEventArg.changed, false);

    observable.set("age", 55);

    eq(observable.age, 55);
    eq(changeCount, 4);
    eq(typeof lastEventArg.changed, "object");
    eq("name" in lastEventArg.changed, false);
    eq("age" in lastEventArg.changed, true);

    observable.set({
        name: "guy",
        age: 50
    });

    eq(observable.name, "guy");
    eq(observable.age, 50);
    eq(changeCount, 5);
    eq(typeof lastEventArg.changed, "object");
    eq("name" in lastEventArg.changed, true);
    eq("age" in lastEventArg.changed, true);

});