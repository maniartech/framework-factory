module('attributes');

test ('Attribute Tests', function() {


    var user1 = new membership.User(),
        user2 = new membership.User("abc");

    eq(user1.name, "no-name");
    eq(user2.name, "abc");

    user1.name = "john";
    user2.name = "abraham";

    eq(user1.name, "john");
    eq(user2.name, "abraham");

});

