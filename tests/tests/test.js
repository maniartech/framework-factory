
var eq = strictEqual;
var neq = notStrictEqual;

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
            var person = new Person();
            person.age = 10;
            var t1 = new Teacher('T');
            t1.age = 20;
            neq(t1.age, person.age);

            eq (t1.name, 'T', 'Should call base class\' init method if '
                + 'init in not defined in derived class');

            eq (e1.name, 'abc1', 'If init is defined, init should' +
                    ' utilize _super method to call base class\' init');

            ok (e1 instanceof Employee, 'Must be true because e1 is instance of Employee');

            ok (e1 instanceof Person, 'Must be true because e1 is instance of Employee and Employee derived from Person');

            eq (p1.info(), 'Person', 'Must return "Person"');

            eq (e1.info(), 'Employee', 'Must return "Employee"');

            console.log(Employee.__meta__);

        }
    };

    test ('Basic Tests', classTests.basic);
    test ('Class Attach Tests', classTests.attachMembers);
    test ('Class Set Tests', classTests.setValues);
    test ('Class Object Comparision Tests', classTests.objectComparisions);
    test ('Inheritance Tests', classTests.inheritance);


module('TypeHandler Tests');

    var typeHandlerTests = {

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
            var c1 = new Component();
            eq(c1.clickCount, 0, "Intial count should be 0.");
            c1.click();
            eq(c1.clickCount, 1, "Count incremented");
            count = 100;
            raises(function() {
                c1.clickCount = 100;
            }, "Readonly properties cannot be assigned.");

            eq (c1.clickCount, 1, "Count didnt increment because it is a readonly.");
        },

        properties: function() {

  //           //Component Tests
  //           var c1 = new Component();

  //           var changingCount = 0;
  //           var changedCount = 0;
  //           //c1.name = "great";

  //           c1.namechanging(function() {
        // changingCount++;
  //           });

  //           c1.namechange(function() {
  //               changedCount++;
  //           });

  //           c1.name = "abc";
  //           eq (changingCount, 1);
  //           eq (changedCount, 1);
  //           c1.name = "abc";
  //           eq (changingCount, 1, 'Should not trigger an property change events is the new value is same');
  //           eq (changedCount, 1, 'Should not trigger an property change events is the new value is same');
  //           c1.name = "xyz";
  //           eq (changingCount, 2);
  //           eq (changedCount, 2);

  //           var c2 = new Component();
  //           neq(c1.name, c2.name, 'Properties of both the object must independently work.');
  //           c2.name = "wonderful";
  //           eq (changingCount, 2, 'Should not trigger an property change events if an another object is changed.');
  //           eq (changedCount, 2, 'Should not trigger an property change events if an another object is changed.');

  //           eq(c1.width, 0);
  //           c1.width = 10;
  //           eq(c1.width, 10);
     //    eq(c1.length, 0, "Initial length is zero");



            //PropClass Tests
            var PropClass = framework.Class({

                init: function() {
                    this._list = [1, 2, 3, 4, 5];
                },

                length : framework.property({
                    get: function() {
                        return this._list.length;
                    }
                }),

                name : framework.property({
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
                birthday     : framework.property('1-1') //observable false

            });

            var propObj = new PropClass(),
                errors = 0,
                events = 0;

            function propChanging(args) {
                eq (propObj, this);
                eq (this instanceof PropClass, true);
                neq (args.oldValue, undefined);
                neq (args.oldVaue, args.newValue);
                events++;
            }

            function propChanged(args) {
                eq (propObj, this);
                eq (this instanceof PropClass, true);
                neq (args.oldValue, undefined);
                neq (args.oldVaue, args.newValue);
                events++;
            }

            propObj.onPropertyChanging = propChanging;
            propObj.onPropertyChanged = propChanged;

            eq(propObj.length, 5);
            eq('_length' in propObj, false);
            eq (typeof propObj.length, 'number');
            try { propObj.length = 10; } catch (ex) { errors++; }
            eq(errors, 1, 'Can not set readonly properties.');

            eq (propObj.name, 'Aamir');
            eq (propObj._name, 'Aamir');
            eq (typeof propObj.name, 'string');
            propObj.name = 'Maniar';
            eq (propObj.name, 'Maniar');
            eq (propObj._name, 'Maniar');

            eq (propObj.age, 37);
            eq (propObj._age, 37);
            try { propObj.age = 100; } catch (ex) { errors++; }
            eq(errors, 2, 'Can not set readonly properties.');

            eq (propObj.birthday, '1-1');
            eq (propObj._birthday, '1-1');
            propObj.birthday = '21-11';
            eq (propObj.birthday, '21-11');
            //eq (2, events);
            eq (propObj._birthday, '21-11');
        },

        attachProperty: function() {
            var obj = {},
                error = 0;
            framework.attachProperty(obj, "name",
                function(){
                     return obj._name;
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
            };

            o1.time = new Date();
            o2.time = new Date();
            eq(o1.time === o2.time, false);
            eq(framework.utils.equals(o1.time, o2.time), true);
            eq(framework.utils.equals(o1, o2), true);

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

            eq(s.id, "main");
            eq(s.x, 10);
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
            eq(a.name, b.name, "Property value should be same.");
            eq(a.age, b.age, "Property value should be same.");
            neq(a.items, b.items);
            b.items.add("Wow")



        }
    };

    test('Object.deepCopy Tests', miscTests.deepCopy);



//});