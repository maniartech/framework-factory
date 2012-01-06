

var framework = FrameworkFactory.create();

framework.BaseObject = framework.Class({

}, Object);

framework.defaultBaseClass = framework.BaseObject;

var Person = framework.Class({

        age: -1, //default

        init: function(name) {
            this.name = name;
        },

        getName: function() {
            return this.name;
        },

        info: function() {
            return 'Person';
    }

});



var Employee = framework.Class({
    init: function(name) {
        this.base(name);
    },

    info: function() {
        return 'Employee';
    }

}, Person);

var Teacher = framework.Class({

}, Person);

var Button = framework.Class({

    //Attributes
    clickCount: framework.attribute(0, {
        type: 'number'
    }),
    caption: framework.attribute('Button', {
        type: 'string'
    }),
    isDefault: framework.attribute(false, {
        type: 'boolean'
    }),

    //Events
    click: framework.event(),
    mouseMove: framework.event(),

    //Constructor
    init: function(caption) {
        if (caption) {
            this.caption = caption;
        }
    }
});

var Shape = framework.Class({
    id: 'shape',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    init: function() {
        this.children = new framework.collections.MapList();
        if (arguments.length > 0) {
            framework.utils.loadFromJSON(this, arguments[0]);
        }
    }
});

var Component = framework.Class({

    count: framework.readonly(0),
    widthCount: framework.readonly(0),
    name : framework.property(),
    width: framework.property(0, {
        get: function() {
            return this._widthCount;
        },
        set: function(v) {
            this._widthCount = v;
            //alert(this._widthCount);
            console.log(this);
        },
        silent: true
    }),

    init: function() {

    },
    click: function() {
        this._count += 1;
    }
});

var p1 = new Person("abc");
var p2 = new Person("xyz");

var e1 = new Employee("abc1");