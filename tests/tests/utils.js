module('utils');

var utils = framework.utils;

test('Equals Tests', function() {

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

        });

test('JSON Tests', function() {

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
        });

test('Object.deepCopy Tests', function() {

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



        });


