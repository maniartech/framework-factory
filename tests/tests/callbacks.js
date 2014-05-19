module('callbacks');

test ('Callback Tests', function() {


    var user1 = new membership.Employee(),
        updateCount = 0;

    neq(user1.onUpdate, undefined);
    eq(user1.onUpdate, false);


    user1.onUpdate = function() {
        updateCount += 1;
    }

    eq(updateCount, 0);
    user1.update();
    eq(updateCount, 1);
    user1.update();
    eq(updateCount, 2);
    user1.onUpdate = false;
    user1.update();
    eq(updateCount, 2);
});

