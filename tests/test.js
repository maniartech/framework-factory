
var eq = strictEqual;
var neq = notStrictEqual;

//$(function(){


module("Core Tests");

    var frameworkTests = {

        basic: function() {

            eq(typeof FrameworkFactory, 'object');
            eq(FrameworkFactory.version, '1.0.0');
            var ns = FrameworkFactory.create();
            neq (ns, undefined, 'The namespace ns must not be undefined.');
            neq (ns, null, 'The namespace ns must not be null.');
            eq (ns.version, '1.0.0', "Default version must be 1.0.0");
            //eq (ns.framework, 'framework', 'The default framework full name must be "framework"');
        },

        noConflict: function() {
            //For framework with no version and noConflict = false
            var ns = FrameworkFactory.create('wonderFramework'), error = 0;
            eq(ns.version, '1.0.0');
            eq(ns.config('noConflict'), false);

            //For framework with no name, no version and noConflict = false
            ns = FrameworkFactory.create();
            eq(ns.version, '1.0.0');
            eq(ns.config('noConflict'), false);

            //For framework with no version and noConflict = false passed as config options
            ns = FrameworkFactory.create({
                    framework: 'wonderFramework'
                });
            eq(ns.version, '1.0.0');
            eq(ns.config('noConflict'), false);

            //For framework with noConflict = true
            ns = FrameworkFactory.create({
                framework: 'wonderFramework',
                noConflict: true
            });
            
            eq(ns.noConflict(), ns);

            try {
                FrameworkFactory.create({
                    noConflict: true
                });
            }
            catch (ex) {
                error += 1;
            }

            eq(error, 1);

            window.wonderFramework = ns;
            ns = FrameworkFactory.create({
                framework: 'wonderFramework',
                noConflict: true,
                version: '2.0.0'
            });

            neq(ns, window.wonderFramework); 
            eq(ns.noConflict(), window.wonderFramework);

            window.wonderFramework = ns;
            eq(window.wonderFramework.version, '2.0.0');
            ns = window.wonderFramework.noConflict();
            eq(ns.version, '1.0.0');
            eq(window.wonderFramework.version, '2.0.0');

        },

        customConfig: function() {

            var ns = FrameworkFactory.create({
                version: '1.0.1',
                framework: 'MyFramework',
                defaultBaseClass: "BaseObject"
            });
			
			eq(ns.BaseObject, undefined);			
			ns.BaseObject = ns.Class({
            });
			neq(ns.BaseObject, undefined);
			
			var ChildClass = ns.Class({
            });
            eq(new ChildClass() instanceof ns.BaseObject, true);

            ns.BaseObject.attach({
                hi: function(msg) {
                    return 'Hi, ' + msg + '.';
                }
            });

            neq (ns, undefined, 'The namespace ns must not be undefined.');
            neq (ns, null, 'The namespace ns must not be null.');
            eq (ns.version, '1.0.1', "Default version must be 1.0.1");
            eq (ns.framework, 'MyFramework', 'The default framework full name must be "MyFramework"');

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
            eq(is.plainObject(new Date), false);
            eq(is.plainObject(new Component), false);

            //Array tests
            eq(is.array([]), true);
            eq(is.array(new Array), true);
            eq(is.array("str"), false);
            eq(is.array(0), false);
            eq(is.array(new Function()), false);
            eq(is.array(), false);
            eq(is.array(null), false);
            eq(is.array(new Date), false);
            eq(is.array(new Component), false);

            //In Browser
            eq(is.inBrowser(), true);


        }
    };

    test("Framework Basic", frameworkTests.basic);
    test("Framework noConflict tests", frameworkTests.noConflict);
    test ('Custom Config Tests', frameworkTests.customConfig);
    test ('Plugins Tests', frameworkTests.pluginsTests);
    test ('Is of Type Tests', frameworkTests.isTests);


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

        readonly: function() {
            var c1 = new Component(),
                errorsCount = 0;

			eq(c1.clickCount, 0, "Intial count should be 0.");
            c1.click();
            eq(c1.clickCount, 1, "Count incremented");
            count = 100;
            try { c1.clickCount = 100; } catch (e) { errorsCount++; }
            eq (c1.clickCount, 1, "Count didnt increment because it is a readonly.");
            eq (errorsCount, 1, "While changing readonly, it must throw an error.");
        },

        properties: function() {

            //Component Tests
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
			
			eq(c1.length, 0, "Initial length is zero");
			
			

            //PropClass Tests
            var PropClass = framework.Class({

                init: function() {
                    this._list = [1, 2, 3, 4, 5];
                },

                length      : framework.property({ //default not observable, but readonly
                    get: function() {
                        return this._list.length;
                    }
                }),

                name        : framework.property({ //default not observable
                    value: "Aamir",
                    get:  function() {
                        return this._name;
                    },
                    set: function(v) {
                        if (this._name !== v) {
                            this._name = v;
                        }
                    }
                }),

                age          : framework.readonly(37), //default observable from settings
                birthday     : framework.property('1-1', true) //observable false

            });

            var propObj = new PropClass()
                errors = 0,
                events = 0;

            function propChanging(args) {
                eq (args.eventName, 'propertyChanging');
                eq (propObj, this);
                eq (this instanceof PropClass, true);
                neq (args.oldValue, undefined);
                neq (args.oldVaue, args.newValue);
                events++;
            }

            function propChanged(args) {
                eq (args.eventName, 'propertyChanged');
                eq (propObj, this);
                eq (this instanceof PropClass, true);
                neq (args.oldValue, undefined);
                neq (args.oldVaue, args.newValue);
                events++;
            }

            propObj.propertyChanging(propChanging);
            propObj.propertyChanged(propChanged);

            eq(propObj.length, 5);
            eq('_length' in propObj, false);
            eq (typeof propObj.length, 'number');
            try { propObj.length = 10; } catch (ex) { errors++; };
            eq(errors, 1, 'Can not set readonly properties.');

            eq (propObj.name, 'Aamir');
            eq (propObj._name, 'Aamir');
            eq (typeof propObj.name, 'string');
            propObj.name = 'Maniar';
            eq (propObj.name, 'Maniar');
            eq (propObj._name, 'Maniar');

            eq (propObj.age, 37);
            eq (propObj._age, 37);
            try { propObj.age = 100; } catch (ex) { errors++; };
            eq(errors, 2, 'Can not set readonly properties.');

            eq (propObj.birthday, '1-1');
            eq (propObj._birthday, '1-1');
            propObj.birthday = '21-11'
            eq (propObj.birthday, '21-11');
            eq (2, events);
            eq (propObj._birthday, '21-11');
        },
		
		attachProperty: function() {
			var obj = {},
			    error = 0;
			framework.attachProperty(obj, "name", 
			function(){ 
			     return obj._name
		    }, function (val) {
				obj._name = "Name: " + val;
			});
			
			framework.attachProperty(obj, "justName", function() {
				return obj._name.split(" ")[1];
			});
			
			eq(obj.name, undefined, "Name is undefined initially.");
			obj.name = "Great";
			neq(obj.name, undefined, "Name is initialized.");
			eq(obj.name, "Name: Great", "Name is initialized to Great.");
			eq(obj.justName, "Great", "Name is initialized to Great.");
			try {
				obj.justName = "Another Name";
			}
			catch (e) {
				error += 1;
			}
			eq(error, 1, "Just name is a readonly field, hence error count 1;");
				
		}
    };

    test ('Event Tests', typeHandlerTests.events);
    test ('Attribute Tests', typeHandlerTests.attributes);
    test ('Readonly Attribute Tests', typeHandlerTests.readonly);
    test ('Property Tests', typeHandlerTests.properties);
	test ('Attach Property Tests', typeHandlerTests.attachProperty);

module('framework.utils Tests');

    var utils = framework.utils;

    utilsTests = {

        equals: function() {



            var o1 = {
                name: 'abc',
                age: 20
            };

            var o2 = {
                name: 'abc',
                age: 20
            };

            eq(o1 === o2, false);
            eq(framework.utils.equals(o1, o2), true);

            o2.name = "xyz";
            eq(framework.utils.equals(o1, o2), false);

            o1.name = "xyz";
            eq(framework.utils.equals(o1, o2), true);

            o2.fav = "red";
            eq(framework.utils.equals(o1, o2), false);

            o1.fav = "red";
            eq(framework.utils.equals(o1, o2), true);

            o1.children = {
                name : "wow"
            }
            eq(framework.utils.equals(o1, o2), false);

            o2.children = {
                name : "wow"
            }

            o1.time = new Date();
            o2.time = new Date();
            eq(o1.time === o2.time, false);
            eq(framework.utils.equals(o1.time, o2.time), true);
            eq(framework.utils.equals(o1, o2), true);

        },

        equalsAdvanced: function () {

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

    test('Equals Tests', utilsTests.equals);
    test('JSON Tests', utilsTests.json);



module('Miscellaneous Tests');

    var utils = framework.utils;

    miscTests = {
        deepCopy: function() {

            //Test with existing Button class
            var a = new Button();
            a.name = "Maniar";
            a.ref = new Button();
            var b = utils.deepCopy(a);
            a.ref.name = "Wow";
            eq(false, a === b);
            a.name = "Aamir";
            neq(a.name, b.name);
            neq(a, b.ref);
            neq(a.ref, b);
            neq(b.ref, a);
            neq(a.ref, b.ref);

            var BaseClass = framework.Class({

            });

            var RefClass = framework.Class({
                name: framework.property('RefClass')
            });

            var RefCollectionClass = framework.Class({

            }, framework.collections.MapList);

            var CopyClass = framework.Class({
                length: framework.readonly(0),
                name: framework.property('MyName'),
                age: framework.property({
                    defaultValue: 20,
                    get: function() {
                        return this._age;
                    },
                    set: function(val) {
                        this._age = val;
                    }
                }),
                items: framework.readonly(),
                ref: framework.attribute(),

                init: function() {
                    this._items = new RefCollectionClass();
                    this.ref = new RefClass();
                }

            }, BaseClass);

            var a = new CopyClass();
            a.name = "Great";
            a.age = 30;
            var b = utils.deepCopy(a);

            neq(a, b);
            eq(a.name, b.name);
            eq(a.age, b.age);
            neq(a.items, b.items);
            b.items.add("Wow")





        }
    };

    test('Object.deepCopy Tests', miscTests.deepCopy);



//});