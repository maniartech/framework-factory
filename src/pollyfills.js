
Object.create = Object.create ||
function create(o) {
    "use strict";

    function F() {}
    F.prototype = o;
    return new F();
};


Object.getPrototypeOf = Object.getPrototypeOf ||
function getPrototypeOf() {
    "use strict";

    if (typeof "test".__proto__ === "object") {
        Object.getPrototypeOf = function (o) {
            return o.__proto__;
        };
    } else {
        Object.getPrototypeOf = function (o) {
            // May break if the constructor has been tampered with
            return o.constructor.prototype;
        };
    }
};

Array.prototype.indexOf = Array.prototype.indexOf ||
function indexOf(obj, start) {
    "use strict";

    for (var i = (start || 0), j = this.length; i < j; i += 1) {
        if (this[i] === obj) {
            return i;
        }
    }
    return -1;
};


String.trim = String.trim ||
function trim(s) {
    "use strict";
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
