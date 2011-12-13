$(function(){

    var eq = strictEqual;
    var neq = notStrictEqual;

    module("Namespace Tests");

    //Namespace Tests
    test("Namespace Not Null Test", function() {

        var ns = FrameworkFactory.create({
                version: '1.0.0'
            });

        neq (ns, undefined, 'The namespace ns must not be undefined.');
        neq (ns, null, 'The namespace ns must not be null.');

    });

    //Default Options Tests
    test ("Default Options Tests", function() {
        var ns = FrameworkFactory.create();
        eq (ns.version, '1.0.0', "Default version must be 1.0.0");
        eq (ns.fullName, 'framework', 'The default framework full name must be "framework"');
        eq (ns.privateMemberPrefix, '_', 'The default private member prefix is "_"');
        eq(ns.defaultBaseClass, Object, 'The default base class must be Object');
    });

    //Namespace Options Change Tests
    test ('Namespace Options Change Tests', function(){

        function BaseObject() {}

        var ns = FrameworkFactory.create({
            version: '1.0.1',
            fullName: 'MyFramework',
            privateMemberPrifix: '__$',
            defaultBaseClass: BaseObject
        });
        eq (ns.version, '1.0.1', "Default version must be 1.0.1");
        eq (ns.fullName, 'MyFramework', 'The default framework full name must be "MyFramework"');
        eq (ns.privateMemberPrefix, '__$', 'The default private member prefix is "__$"');
        eq(ns.defaultBaseClass, BaseObject, 'The default base class must be BaseObject');
    });

    module("Class Tests");

    var framework = FrameworkFactory.create();
    var Person = framework.Class({

        age: -1,

        init: function(name) {
            this.name = name;
        },

        getName: function() {
            return this.name;
        },

        info: function() {
            return 'Person';
        }

    });

    var Employee = framework.Class({
        init: function(name) {
            this.$super(name);
        },

        info: function() {
            return 'Employee';
        }

    }, Person);

    var Teacher = framework.Class({

    }, Person);


    var p1 = new Person("abc");
    var p2 = new Person("xyz");

    var e1 = new Employee("abc1");

    //Class Tests
    test ('Class Tests', function(){

        eq (typeof Person, 'function', 'Person must be of type function');
        eq (p1.name, 'abc', 'Value of p1.name must be "abc"');
        eq (p1.getName(), 'abc', 'Value of p1.getName() must be "abc"');
        eq (p1.age, -1, 'Value of p1.age must be -1');
        p1.age = 30
        eq (p1.age, 30, 'Value of p1.age must be 30');
    });

    test ('Class Attach Tests', function() {

        var Class = framework.Class();
        neq (Class, undefined, 'Class must not be undefined');
        neq (Class, null, 'Class must not be null');
        eq (typeof Class, 'function', 'Class must be function');

        Class.attach({
            name: 'wow'
        });

        var c1 = new Class();
        eq(c1.name, 'wow');

        Class.attach({
            getName: function() {
                return this.name;
            },
            setName: function(name) {
                this.name = name;
            }
        });
        eq(c1.getName(), 'wow');
        c1.setName('abc');
        eq(c1.getName(), 'abc');

    });

    test ('Class Set Tests', function() {
        Employee.attach({
            empCode: 1,
            department: 10
        });

        var emp = new Employee();
        emp.set({
            empCode: 1,
            department: 20
        });



    });

    test ('Class Object Comparision Tests', function() {

        eq (p2.name, 'xyz', 'Value of p1.name must be "xyz"');
        eq (p1.getName(), 'abc', 'Value of p1.getName() must be "abc"');
        neq( p1.name, p2.name, 'p1.name must not be equal to p2.name');
        p1.age = 30;
        p2.age = 25;
        neq( p1.name, p2.name, 'p1.name must not be equal to p2.name');
    });

    test ('Inheritance Tests', function(){

        var t1 = new Teacher('T');
        eq (t1.name, 'T', 'Should call base class\' init method if '
            + 'init in not defined in derived class');

        eq (e1.name, 'abc1', 'If init is defined, init should' +
                ' utilize _super method to call base class\' init');

        ok (e1 instanceof Employee, 'Must be true because e1 is instance of Employee');

        ok (e1 instanceof Person, 'Must be true because e1 is instance of Employee and Employee derived from Person');

        eq (p1.info(), 'Person', 'Must return "Person"');

        eq (e1.info(), 'Employee', 'Must return "Employee"');

    });

    test ('Event Tests', function() {

        var Button = framework.Class({
            clickCount: 0,
            click: $event(),
            mouseMove: $event(),
            init: function(text) {
                this.text = text;
            }
        });

        var btn = new Button("Button1");

        eq (typeof btn.click, 'function', 'Check event attached');

        var obj, args, val, eventRaised;

        function handler1(o, a) {
            obj = o;
            args = a;
            val = a.val;
            btn.clickCount++;
            eventRaised = a.eventName;
            //console.log(a);
        }

        function handler2 (o, a) {
            btn.clickCount++;
        }

        btn.click(handler1);
        eq (btn._click.length, 1, "Event subsriber count check");
        btn.trigger('click', {
            val: 100
        });

        eq (typeof btn.trigger, 'function', 'Check trigger attached');

        eq (obj, btn, "Event handler must have first argument the object on which event fired.");
        neq (args, null, "Args can not be null.");
        eq (typeof args, 'object', "Supplied args must be of type object.");
        eq (args.val, 100, "Event handler must receive the values supplied.");
        eq (val, 100, "Event handler must receive the values supplied.");
        eq (btn.clickCount, 1, "Event fired once and received once so click count 1");
        eq (eventRaised, 'click', 'Event args should contain the name of event which triggered.');
        btn.click(handler2);

        btn.trigger('click', { val: 100 });

        eq (btn._click.length, 2, "Event subsriber count check");

        eq (btn.clickCount, 3, "Event handler must have first argument the object on which event fired.");

        btn.off('click', handler2);

        eq (btn._click.length, 1, "Event subsriber count check");

        btn.trigger('click', { val: 200 });

        eq (btn.clickCount, 4, "Event handler must have first argument the object on which event fired.");

        var btn2 = new Button("Button2");
        btn2.click(handler1);
        btn2.click(handler2);

        eq (btn._click.length, 1, "Event subsriber count check for button1");
        eq (btn2._click.length, 2, "Event subsriber count check for button2");
        //alert([btn.click.count(), btn2.click.count()]);

        btn2.off('click', handler1);
        btn2.off('click', handler2);

        eq (btn2._click.length, 0, "Event subsriber count check for button2");

        btn2.on('click, mouseMove', handler1);
        eq (btn2._click.length, 1, "Event subsriber count check for button2");
        eq (btn2._mouseMove.length, 1, "Event subsriber count check for button2");

        btn2.set({
            clickCount: 100,
            text: 'Wonderful'
        });

        test ('Fields Tests', function() {
            var Element = framework.Class({

            });
        });

        //console.log(btn2, new btn2.constructor('wow'));

    });
});