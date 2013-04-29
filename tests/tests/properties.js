

test ('Readonly Attribute Tests', function() {
    var c1 = new Component();
    eq(c1.clickCount, 0, "Intial count should be 0.");
    c1.click();
    eq(c1.clickCount, 1, "Count incremented");
    count = 100;
    raises(function() {
        c1.clickCount = 100;
    }, "Readonly properties cannot be assigned.");

    eq (c1.clickCount, 1, "Count didnt increment because it is a readonly.");
});

test ('Property Tests', function() {

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
});

test ('Attach Property Tests', function() {
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

});