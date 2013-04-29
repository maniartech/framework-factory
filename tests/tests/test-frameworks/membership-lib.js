
var membership = FrameworkFactory.create({
    name: "membership",
    version: "1.0"
});

//User Class
membership.User = membership.Class({

    age: -1, //default

    init: function(name) {
        this.name = name || "no-name";
    },

    getName: function() {
        return this.name;
    },

    info: function() {
        return 'User';
    }

});

//Employey Class
membership.Employee = membership.Class({

    age: 20,

    start: membership.event(),

    stop: membership.event(),

    init: function(n) {
        this.base(n);
    },

    info: function() {
        return 'Employee';
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

//Consumer Class
membership.Consumer = membership.Class({

    company: membership.attribute()

}, membership.User);



