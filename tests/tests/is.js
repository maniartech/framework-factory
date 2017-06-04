module("is");

test('Is of Type Tests', function() {

        var is = membership.is;

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
        eq(is.plainObject(new membership.Employee()), false);

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
        eq(is.array(new membership.Employee()), false);

});