module("class");

test ('Basic Tests', function() {

    eq (typeof Person, 'function', 'Person must be of type function');
    eq (p1.name, 'abc', 'Value of p1.name must be "abc"');
    eq (p1.getName(), 'abc', 'Value of p1.getName() must be "abc"');
    eq (p1.age, -1, 'Value of p1.age must be -1');
    p1.age = 30;
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
});

test ('Class Object Comparision Tests', function() {

    eq (p2.name, 'xyz', 'Value of p1.name must be "xyz"');
    eq (p1.getName(), 'abc', 'Value of p1.getName() must be "abc"');
    neq( p1.name, p2.name, 'p1.name must not be equal to p2.name');
    p1.age = 30;
    p2.age = 25;
    neq( p1.name, p2.name, 'p1.name must not be equal to p2.name');
});

test ('Inheritance Tests', function() {
    var person = new Person();
    person.age = 10;
    var t1 = new Teacher('T');
    t1.age = 20;
    neq(t1.age, person.age);

    eq (t1.name, 'T', 'Should call base class\' init method if ' +
        'init in not defined in derived class');

    eq (e1.name, 'abc1', 'If init is defined, init should' +
            ' utilize _super method to call base class\' init');

    ok (e1 instanceof Employee, 'Must be true because e1 is instance of Employee');

    ok (e1 instanceof Person, 'Must be true because e1 is instance of Employee and Employee derived from Person');

    eq (p1.info(), 'Person', 'Must return "Person"');

    eq (e1.info(), 'Employee', 'Must return "Employee"');

    console.log(Employee.__meta__);

});

