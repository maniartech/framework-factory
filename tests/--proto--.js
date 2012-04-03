// Prototype file for designing FrameworkFactory behaviours.
// Content of this file will keep on changing.

var framework = FrameworkFactory.create('framework');

//Different ways to define properties

var Test = framework.Class({

    init: function() {
        this._list = [];
    },

    length      : framework.property({ //default not observable
        get: function() {
            return this._list.length;
        }
    }),

    name        : framework.property({ //default not observable
        defaultValue: "",
        get:  function() {
            return this._name;
        },
        set: function(v) {
            if (this._name != v) {
                this._name = v;
            }
        }
    }),

    age          : framework.readonly(-1), //default observable from settings
    birthdate    : framework.property('1-1-1', true), //observable false


});