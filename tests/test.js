
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
        
        defaultOptions: function() {
            var ns = FrameworkFactory.create();
            eq (ns.version, '1.0.0', "Default version must be 1.0.0");
            eq (ns.fullName, 'framework', 'The default framework full name must be "framework"');
            eq (ns.privateMemberPrefix, '_', 'The default private member prefix is "_"');
            eq(ns.defaultBaseClass, Object, 'The default base class must be Object');
        },
        
        optionsChanged: function(){

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
        }
    };

    test("Framework Not Null Test", frameworkTests.notNull);
    test ("Default Options Tests", frameworkTests.defaultOptions);
    test ('Namespace Options Change Tests', frameworkTests.optionsChanged);

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
            
        }
    };
    
    test ('Event Tests', typeHandlerTests.events);
    test ('Attribute Tests', typeHandlerTests.attributes);

module('Plugins Tests');

    var pluginTests = {
        
        basic: function() {
            FrameworkFactory.plugin(function($f){
                $f.myPlugin = {
                    echo: function(message) {
                        return message;
                    }
                }
                
                $f.myPlugin.Test = $f.Class({
                    echo: function(message) {
                        return message;
                    }
                }, Object);
            });
            
            neq(undefined, framework.myPlugin);
            eq('wow', framework.myPlugin.echo('wow'));
            eq('function', typeof framework.myPlugin.Test);
            var t = new framework.myPlugin.Test();
            eq('great', t.echo('great'));
            console.log(t.echo);
        }
    };
    
    test ('Plugins Tests', pluginTests.basic);

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
            console.log(list);
            
        }
    };
    
    test('MapList Tests', maplistTests.basic);
    

module('framework.utils Tests');

    var utils = framework.utils;

    utilsTests = {
        basic: function() {
            
            eq ('_key', utils.getPrivateKey('key'));
            eq ('__key', utils.getProtectedKey('key'));
            var b = new Button();
            //var b2 = utils.clone(b);
        },
        set: function() {
            
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
    test('Set Tests', utilsTests.set);
    
    






//});