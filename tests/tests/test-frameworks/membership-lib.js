function main(FrameworkFactory) {

    var membership = FrameworkFactory.create({
        name: "membership",
        version: "1.0"
    });

    //User Class
    membership.User = membership.Class({

        age: -1, //default

        init: function User(name) {
            this.name = name || "no-name";
        },

        getName: function() {
            return this.name;
        },

        info: function() {
            return 'User';
        },

        testLevelSkip: function () {
            return "User";
        }

    });

    //Employey Class
    membership.Employee = membership.Class({

        // age: 20,

        start: membership.event(),

        stop: membership.event(),

        init: function Employee (n) {
            this.base(n);
        },

        info: function() {
            return 'Employee';
        },

        onUpdate: membership.callback(),

        update: function() {
            if (this.onUpdate) this.onUpdate();
        },

        getName: function () {
            var name = this.base();
            return "Employee: " + name;
        },

        startWork: function(work) {
            this.trigger('start', {
                work: work
            });
        },

        stopWork: function() {
            this.trigger('stop');
        }

    }, membership.User);


    membership.SalesGuy = membership.Employee.extend({
        getName: function () {
            var name = this.base();
            return "SalesGuy: " + name;
        },

        testLevelSkip: function () {
            return "Sales " + this.base();
        },

        noBase: function () {
            return this.base();
        }
    });

    //Consumer Class
    membership.Consumer = membership.User.extend({
        company: membership.attribute()
    });

    window.membership = membership;
    return membership;
}

//Load environment
if (typeof module !== "undefined" && typeof module.exports === "object") {
    module.exports = main;
}
else {
    main(this.FrameworkFactory);
}