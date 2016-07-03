"use strict";

var FrameworkFactory = require("../lib/framework-factory-all.js");
var components = require("./tests/test-frameworks/component-lib.js")(FrameworkFactory);

class XProperty extends components.PropertyClass {

    constructor(name) {
        super("Aamir");
        this._p2 = name;
        console.log("wow");
    }

    get test() {
        return this._test;
    }

    set test(v) {
        this._test = v;
    }

}

var x = new XProperty();

