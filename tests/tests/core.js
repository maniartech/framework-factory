module("Core Tests");

var frameworkTests = {

    customConfig: function() {

        var ns = FrameworkFactory.create({
            version: '1.0.1',
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
        eq (ns.version, '1.0.1', "Default version must be 1.0.1");
        eq (ns.name, 'MyFramework', 'The default framework full name must be "MyFramework"');

        var Cls = ns.Class({});
        var inst = new Cls(); //Class instance.
        eq (inst instanceof ns.BaseObject, true);
        eq(inst.hi('there'), 'Hi, there.');
    },

    pluginsTests: function() {

        function myPlugin($f, config) {
            $f.echo = function echo(val) {
                return  val;
            }
        };

        myPlugin.info = {
            name: 'myPlugin'
        };

        eq (typeof FrameworkFactory.plugins, 'object');
        FrameworkFactory.plugins.register(myPlugin);

        var myFramework = FrameworkFactory.create('myFramework');
        neq (FrameworkFactory.plugins.getNames().indexOf('myPlugin'), -1);
        neq (FrameworkFactory.plugins.toArray().indexOf(myPlugin), -1);
        neq (myFramework.echo, undefined);
        eq (myFramework.echo('wow'), 'wow');
    },

    isTests: function() {
        var is = framework.is;

        //String tests
        eq(is.string("str"), true);
        eq(is.string(new String("str")), true);
        eq(is.string(new Number("str")), false);
        eq(is.string(new Date()), false);
        eq(is.string(new Function()), false);
        eq(is.string(), false);
        eq(is.string(null), false);
        eq(is.string([]), false);
        eq(is.string({}), false);

        //Number tests
        eq(is.number(0), true);
        eq(is.number(new Number(100)), true);
        eq(is.number("str"), false);
        eq(is.number(new Date()), false);
        eq(is.number(new Function()), false);
        eq(is.number(), false);
        eq(is.number(null), false);
        eq(is.number([]), false);
        eq(is.number({}), false);

        //function tests
        eq(is.func(function(){}), true);
        eq(is.func(new Function()), true);
        eq(is.func("str"), false);
        eq(is.func(new Date()), false);
        eq(is.func(0), false);
        eq(is.func(), false);
        eq(is.func(null), false);
        eq(is.func([]), false);
        eq(is.func({}), false);

        //undefined tests
        var x;
        eq(is.undef(), true);
        eq(is.undef(x), true);
        eq(is.undef("str"), false);
        eq(is.undef(new Date()), false);
        eq(is.undef(0), false);
        eq(is.undef(null), false);
        eq(is.undef([]), false);
        eq(is.undef({}), false);

        //null or undefined tests
        eq(is.nullOrUndef(null), true);
        eq(is.nullOrUndef(x), true);
        eq(is.nullOrUndef(), true);
        eq(is.nullOrUndef("str"), false);
        eq(is.nullOrUndef(new Date()), false);
        eq(is.nullOrUndef(0), false);
        eq(is.nullOrUndef([]), false);
        eq(is.nullOrUndef({}), false);

        //date tests
        eq(is.date(new Date), true);
        eq(is.date("str"), false);
        eq(is.date(0), false);
        eq(is.date(new Function()), false);
        eq(is.date(), false);
        eq(is.date(null), false);
        eq(is.date([]), false);
        eq(is.date({}), false);

        //date tests
        eq(is.plainObject({}), true);
        eq(is.plainObject(new Object), true);

        eq(is.plainObject("str"), false);
        eq(is.plainObject(0), false);
        eq(is.plainObject(new Function()), false);
        eq(is.plainObject(), false);
        eq(is.plainObject(null), false);
        eq(is.plainObject([]), false);
        eq(is.plainObject(new Date()), false);
        eq(is.plainObject(new Component()), false);

        //Array tests
        eq(is.array([]), true);
        eq(is.array(new Array()), true);
        eq(is.array("str"), false);
        eq(is.array(0), false);
        eq(is.array(function () {}), false);
        eq(is.array(undefined), false);
        eq(is.array(), false);
        eq(is.array(null), false);
        eq(is.array(new Date()), false);
        eq(is.array(new Component()), false);

        //In Browser
        eq(is.inBrowser(), true);


    }
};

test("Framework Basic", function () {
    eq(typeof FrameworkFactory, 'object');
    eq(FrameworkFactory.version, '1.0.0');
    var ns = FrameworkFactory.create();
    neq(ns, undefined, 'The namespace ns must not be undefined.');
    neq(ns, null, 'The namespace ns must not be null.');
    eq(ns.version, '1.0.0', "Default version must be 1.0.0");
    //eq (ns.framework, 'framework', 'The default framework full name must be "framework"');
});

test('Custom Config Tests', frameworkTests.customConfig);
test('Plugins Tests', frameworkTests.pluginsTests);
test('Is of Type Tests', frameworkTests.isTests);