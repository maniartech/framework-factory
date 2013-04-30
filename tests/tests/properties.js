module("properties");

test ('readonly', function() {

    var ro = new components.ReadonlyClass("wow"),
        ro2 = new components.ReadonlyClass("Amazing"),
        readonly = components.readonly({
            value: 20,
            get: function() {}
        });

    eq(readonly.type, "readonly");
    eq(readonly.value, 20);
    eq(readonly.readonly, true);
    eq(typeof readonly.get, "function");
    eq(typeof readonly.set, "undefined");

    neq(components.readonly, undefined);

    eq(ro.readonly, true);
    eq(ro._readonly, true);

    eq(ro.readonly2, 10);
    eq(ro._readonly2, 10);

    eq(ro.readonly3, "wow");
    eq(ro._readonly3, "wow");

    eq(ro.readonly4, false);
    eq(ro._readonly4, false);

    eq(ro2.readonly, true);
    eq(ro2._readonly, true);

    eq(ro2.readonly2, 10);
    eq(ro2._readonly2, 10);

    eq(ro2.readonly3, "Amazing");
    eq(ro2._readonly3, "Amazing");

    eq(ro2.readonly4, false);
    eq(ro2._readonly4, false);

    raises(function(){
        ro.readonly = false;
    });

    raises(function(){
        ro.readonly2 = false;
    });

    raises(function(){
        ro.readonly3 = false;
    });

    raises(function(){
        ro.readonly4 = true;
    });

});

test ('property', function() {

    var po1 = components.PropertyClass("one"),
        po2 = components.PropertyClass("two"),
        pa = components.property(10),
        pb = components.property({ value: 10, get: function () {}, set: function () {} }),
        pc = components.property({ value: 10, get: function () {} });

    eq(pa.type, "property");
    eq(pa.readonly, false);
    eq(pa.value, 10);
    eq(typeof pa.get, "undefined");
    eq(typeof pa.set, "undefined");

    eq(pb.type, "property");
    eq(pb.readonly, false);
    eq(pb.value, 10);
    eq(typeof pb.get, "function");
    eq(typeof pb.set, "function");

    eq(pc.type, "readonly");
    eq(pc.readonly, true);
    eq(pc.value, 10);
    eq(typeof pc.get, "function");
    eq(typeof pc.set, "undefined");

    eq(po1.p1, 10);
    eq(po2.p1, 10);
    po1.p1 = 20;
    eq(po1.p1, 20);
    eq(po2.p1, 10);

    eq(po1.p2, 20);
    eq(po2.p2, 20);
    po1.p2 = 30;
    eq(po1.p2, 30);
    eq(po2.p2, 20);

    eq(po1.p3, "one");
    eq(po2.p3, "two");
    po1.p3 = 1;
    eq(po1.p3, 1);
    eq(po2.p3, "two");

    eq(po1.p4, true);
    eq(po2.p4, true);
    raises(function () {
        po1.p4 = false;
    });
    raises(function () {
        po2.p4 = false;
    });

});

test ('attachProperty', function() {
    var obj = {};

    components.attachProperty(obj, "name",
        function(){
             return obj._name;
        }, function (val) {
            obj._name = val;
        });

    eq(typeof components.attachReadonly, "function");

    components.attachProperty(obj, "readonly", function() {
        return  true;
    });

    eq(obj.name, undefined, "Name is undefined initially.");
    obj.name = "Great";
    eq(obj.name, "Great", "Name is initialized to Great.");
    eq(obj.readonly, true);
    raises(function() {
        obj.readonly = false;
    });

});

test ('attachReadonly', function() {
    var obj = {};

    eq(typeof components.attachReadonly, "function");

    components.attachReadonly(obj, "name", function() {
        return "John";
    });

    eq(obj.name, "John");

    raises(function(){
        obj.name = "Peter";
    });


});
