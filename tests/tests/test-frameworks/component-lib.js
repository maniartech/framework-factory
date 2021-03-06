
function main(FrameworkFactory) {

    var components = FrameworkFactory.create({
        name: "components",
        version: "1.0"
    });

    //Helper class for testing readonly properties
    components.ReadonlyClass = components.Class({

        type: 'ReadonlyClass',

        readonly: components.readonly(true),

        readonly2: components.readonly({
            default: 10,
            get: function() {
                return this._readonly2;
            }
        }),

        readonly3: components.readonly({
            get: function() {
                return this._readonly3;
            }
        }),

        readonly4: components.readonly({
            default: false,
            get: function() {
                return this._readonly4;
            },
            set: function(v) {
                console.log("This function should never be called.");
            }
        }),

        init: function(v) {
            this._readonly3 = v;
        }
    });

    //Helper class for testing readonly properties
    components.PropertyClass = components.Class({

        p1: components.property(10),

        p2: components.property({
            default: 20,
            get: function() {
                return this._p2;
            },
            set: function (v) {
                this._p2 = v;
            }
        }),

        p3: components.property({
            get: function() {
                return this._p3;
            },
            set: function(v) {
                this._p3 = v;
            }
        }),

        p4: components.property({
            get: function() {
                return true;
            }
        }),


        init: function(v) {
            this._p3 = v;
        },

    });

    // components.ObservableClass = components.Class({

    //     name: components.observable("buddy"),

    //     age: components.observable(30)

    // });

    window.components = components;
    return components;

}

//Load environment
if (typeof module !== "undefined" && typeof module.exports === "object") {
    module.exports = main;
}
else {
    main(this.FrameworkFactory);
}