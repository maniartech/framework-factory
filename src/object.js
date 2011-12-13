
    Object.create = Object.create || function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };

    Object.getPrototypeOf = Object.getPrototypeOf || function() {

        if (typeof "test".__proto__ === "object" ) {
            Object.getPrototypeOf = function(o){
                return o.__proto__;
            };
        } else {
            Object.getPrototypeOf = function(o){
                // May break if the constructor has been tampered with
                return o.constructor.prototype;
            };
        }
    };
