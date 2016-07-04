module("core");

test("Framework Basic", function () {
    eq(typeof FrameworkFactory, 'object');
    eq(FrameworkFactory.version, '1.1.0');
    var ns = FrameworkFactory.create();
    neq(ns, undefined, 'The namespace ns must not be undefined.');
    neq(ns, null, 'The namespace ns must not be null.');
    eq(ns.version, '1.0.0', "Default version must be 1.0.0");
    //eq (ns.framework, 'framework', 'The default framework full name must be "framework"');
});

test('Custom Config Tests', function() {

    var ns = FrameworkFactory.create({
        version: '1.0.0',
        name: 'MyFramework',
        defaultBaseClass: "BaseObject"
    });

    eq(ns.BaseObject, undefined);
    ns.BaseObject = ns.Class({
    });
    neq(ns.BaseObject, undefined);

    var ChildClass = ns.Class();
    eq(new ChildClass() instanceof ns.BaseObject, true);

    ns.BaseObject.attach({
        hi: function(msg) {
            return 'Hi, ' + msg + '.';
        }
    });

    neq (ns, undefined, 'The namespace ns must not be undefined.');
    neq (ns, null, 'The namespace ns must not be null.');
    eq (ns.version, '1.0.0', "Default version must be 1.1.0");
    eq (ns.name, 'MyFramework', 'The default framework full name must be "MyFramework"');

    var Cls = ns.Class({});
    var inst = new Cls(); //Class instance.
    eq (inst instanceof ns.BaseObject, true);
    eq(inst.hi('there'), 'Hi, there.');
});


