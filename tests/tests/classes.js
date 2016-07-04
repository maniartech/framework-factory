module("class");

test ('Basic Tests', function() {

    var user = new membership.User("abc");

    eq (typeof membership.User, 'function', 'User must be of type function');
    eq (user.name, 'abc', 'Value of user.name must be "abc"');
    eq (user.getName(), 'abc', 'Value of user.getName() must be "abc"');
    eq (user.age, -1, 'Value of user.age must be -1');
    user.age = 30;
    eq (user.age, 30, 'Value of user.age must be 30');
});

test ('Class Attach Tests', function() {

    var Class = membership.Class();
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
    membership.Employee.attach({
        empCode: 1,
        department: 10
    });
});

test ('Class Object Comparision Tests', function() {

    var user1 = new membership.User("abc"),
        user2 = new membership.User("xyz");

    eq (user2.name, 'xyz', 'Value of user2.name must be "abc"');
    eq (user1.getName(), 'abc', 'Value of user1.getName() must be "abc"');
    neq( user1.name, user2.name, 'user1.name must not be equal to user2.name');
    user1.age = 30;
    user2.age = 25;
    neq( user1.name, user2.name, 'user1.name must not be equal to user2.name');
});

test ('Inheritance Tests', function() {

    var user = new membership.User(),
        employee = new membership.Employee("abc1"),
        consumer = new membership.Consumer('Consumer'),
        salesGuy = new membership.SalesGuy("Sales");

    neq(membership.User.extend, undefined);
    neq(membership.Employee.extend, undefined);
    neq(membership.Consumer.extend, undefined);
    neq(membership.SalesGuy.extend, undefined);

    user.age = 10;
    consumer.age = 20;
    eq(salesGuy.name, "Sales");
    neq(consumer.age, user.age);
    eq (consumer.name, 'Consumer', 'Should call base class\' init method if ' +
        'init in not defined in derived class');
    eq (employee.name, 'abc1', 'If init is defined, init should' +
            ' utilize _super method to call base class\' init');
    ok (employee instanceof membership.Employee, 'Must be true because employee is instance of Employee');
    ok (employee instanceof membership.User, 'Must be true because employee is instance of Employee and Employee derived from user');
    eq (user.info(), 'User', 'Must return "User"');
    eq (employee.info(), 'Employee', 'Must return "Employee"');

    eq(salesGuy.testLevelSkip(), "Sales User");

});

