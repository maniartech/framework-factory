
var eq = strictEqual;
var neq = notStrictEqual;

//$(function(){


module("Framework Tests");

    var frameworkTests = {
        notNull: function() {
            var ns = FrameworkFactory.create({
                    version: '1.0.0'
                });
            neq (ns, undefined, 'The namespace ns must not be undefined.');
            neq (ns, null, 'The namespace ns must not be null.');
        },

        defaultConfig: function() {
            var ns = FrameworkFactory.create();
            eq (ns.version, '1.0.0', "Default version must be 1.0.0");
            eq (ns.name, 'framework', 'The default framework full name must be "framework"');
        },

        customConfig: function() {

            function BaseObject() {}

            var ns = FrameworkFactory.create({
                version: '1.0.1',
                rootName: 'MyFramework'
            });

            eq (ns.version, '1.0.1', "Default version must be 1.0.1");
            eq (ns.name, 'MyFramework', 'The default framework full name must be "MyFramework"');

            var Cls = ns.Class({});
            var inst = new Cls(); //Class instance.
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

            FrameworkFactory.plugins.register(myPlugin);

            var myFramework = FrameworkFactory.create('myFramework');

            neq (FrameworkFactory.plugins.getNames().indexOf('myPlugin'), -1);
            neq (FrameworkFactory.plugins.getAll().indexOf(myPlugin), -1);
            neq (myFramework.echo, undefined);
            eq (myFramework.echo('wow'), 'wow');
        }

    };

    test("Framework Not Null Test", frameworkTests.notNull);
    test ("Default Config Tests", frameworkTests.defaultConfig);
    test ('Custom Config Tests', frameworkTests.customConfig);
    test ('Plugins Tests', frameworkTests.pluginsTests);


module("Class Tests");

    var classTests = {
        basic: function(){

            eq (typeof Person, 'function', 'Person must be of type function');
            eq (p1.name, 'abc', 'Value of p1.name must be "abc"');
            eq (p1.getName(), 'abc', 'Value of p1.getName() must be "abc"');
            eq (p1.age, -1, 'Value of p1.age must be -1');
            p1.age = 30
            eq (p1.age, 30, 'Value of p1.age must be 30');
        },

        attachMembers: function() {

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

        },

        setValues: function() {
            Employee.attach({
                empCode: 1,
                department: 10
            });

            //var emp = new Employee();
            //emp.set({
            //    empCode: 1,
            //    department: 20
            //});
        },
        objectComparisions: function() {

            eq (p2.name, 'xyz', 'Value of p1.name must be "xyz"');
            eq (p1.getName(), 'abc', 'Value of p1.getName() must be "abc"');
            neq( p1.name, p2.name, 'p1.name must not be equal to p2.name');
            p1.age = 30;
            p2.age = 25;
            neq( p1.name, p2.name, 'p1.name must not be equal to p2.name');
        },
        inheritance: function(){

            var t1 = new Teacher('T');
            eq (t1.name, 'T', 'Should call base class\' init method if '
                + 'init in not defined in derived class');

            eq (e1.name, 'abc1', 'If init is defined, init should' +
                    ' utilize _super method to call base class\' init');

            ok (e1 instanceof Employee, 'Must be true because e1 is instance of Employee');

            ok (e1 instanceof Person, 'Must be true because e1 is instance of Employee and Employee derived from Person');

            eq (p1.info(), 'Person', 'Must return "Person"');

            eq (e1.info(), 'Employee', 'Must return "Employee"');

        }
    };

    test ('Basic Tests', classTests.basic);
    test ('Class Attach Tests', classTests.attachMembers);
    test ('Class Set Tests', classTests.setValues);
    test ('Class Object Comparision Tests', classTests.objectComparisions);
    test ('Inheritance Tests', classTests.inheritance);


module('TypeHandler Tests');

    var typeHandlerTests = {

        events: function(){

            var btn = new Button("Button1");

            eq (typeof btn.click, 'function', 'Check event attached');

            var obj, args, val, eventRaised;

            function handler1(a) {
                obj = this;
                args = a;
                val = a.val;
                console.log(btn.clickCount)
                btn.clickCount++;
                eventRaised = a.eventName;
                //console.log(a);
            }

            function handler2 () {
                btn.clickCount++;
                //console.log(btn.clickCount)
            }

            btn.click(handler1);
            eq (btn._click.length, 1, "Event subsriber count check");
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

            btn2.on('click mouseMove', handler1);

            eq (btn2._click.length, 1, "Event subsriber count check for button2");
            eq (btn2._mouseMove.length, 1, "Event subsriber count check for button2");

            //btn2.set({
            //    clickCount: 100,
            //    text: 'Wonderful'
            //});

            //console.log(btn2, new btn2.constructor('wow'));

        },

        attributes: function() {

            var b1 = new Button();
            var b2 = new Button('Button2');

            eq(b1.caption, 'Button');
            eq(b2.caption, 'Button2');
            b1.clickCount++;
            b1.clickCount++;
            eq (b1.clickCount, 2);
            eq(b1.isDefault, false);
            b1.isDefault = true;
            eq(b1.isDefault, true);

        },

        readonlyAttributes: function() {
            var c1 = new Component();
            var errorsCount = 0;
            eq(c1.count, 0);
            c1.click();
            eq(c1.count, 1);
            count = 100;
            try { c1.count = 100; } catch (e) { errorsCount++; }
            eq (c1.count, 1);
            eq (errorsCount, 1);
        },

        properties: function() {
            var c1 = new Component();
            var changingCount = 0;
            var changedCount = 0;
            //c1.name = "great";
            c1.propertyChanging(function() {
                changingCount++;
            });

            c1.propertyChanged(function() {
                changedCount++;
            });

            c1.name = "abc";
            eq (changingCount, 1);
            eq (changedCount, 1);
            c1.name = "abc";
            eq (changingCount, 1, 'Should not trigger an property change events is the new value is same');
            eq (changedCount, 1, 'Should not trigger an property change events is the new value is same');
            c1.name = "xyz";
            eq (changingCount, 2);
            eq (changedCount, 2);

            var c2 = new Component();
            neq(c1.name, c2.name, 'Properties of both the object must independently work.');
            c2.name = "wonderful";
            eq (changingCount, 2, 'Should not trigger an property change events if an another object is changed.');
            eq (changedCount, 2, 'Should not trigger an property change events if an another object is changed.');

            eq(c1.width, 0);
            c1.width = 10;
            eq(c1.width, 10);
            eq(c1.width, c1.widthCount);


        }
    };

    test ('Event Tests', typeHandlerTests.events);
    test ('Attribute Tests', typeHandlerTests.attributes);
    test ('Readonly Attribute Tests', typeHandlerTests.readonlyAttributes);
    test ('Property Tests', typeHandlerTests.properties);

module('framework.collections Tests');

    var maplistTests = {
        basic: function() {

            var list = new framework.collections.MapList();

            eq (0, list.length, 'New list should have length = 0');
            list.add({
                id: 'wow',
                value: 10
            });
            eq(1, list.length, 'One item added so length should be 1');
            var exceptionCount = 0;
            try { list.add({ id: 'wow' }); } catch (error) { exceptionCount++; }

            eq(1, exceptionCount, 'Exception cound should have been increased by 1.');
            eq(1, list.length, 'Since no new item is added, count should remain the same as earlier.');

            list.add({ id: 'a', val: 1 }, { id: 'b', val: 2});
            eq(3, list.length, 'List length should have been increased by 2.');

            var o = list.get('wow');
            neq (undefined, o);
            eq (10, o.value, 'Reading value from the object with id "wow".');

        }
    };

    test('MapList Tests', maplistTests.basic);


module('framework.utils Tests');

    var utils = framework.utils;

    utilsTests = {
        basic: function() {

            //eq ('_key', utils.getPrivateKey('key'));
            //eq ('__key', utils.getProtectedKey('key'));
            var b = new Button();
            //var b2 = utils.clone(b);
        },
        json: function() {

            var s = new Shape({
                id: 'main',
                x: 10,
                y: 20,
                width: 150,
                height: 250,
                children: [
                    new Shape({ id: 'a' }),
                    new Shape({ id: 'b' })
                ]
            });

            eq('main', s.id);
            eq(10, s.x);
            eq(20, s.y);
            eq(150, s.width);
            eq(250, s.height);
            eq(2, s.children.length);
            eq('a', s.children.get(0).id);
            eq('a', s.children.get('a').id);
            eq('b', s.children.get(1).id);
            eq('b', s.children.get('b').id);
        }

    };

    test('Basic Tests', utilsTests.basic);
    test('JSON Tests', utilsTests.json);








//});