
//Defines the environment
(function(definition, root, undefined) {

    var environment;

    if (module !== undefined && typeof module.exports === "object") {
        environment = "node";
    }
    else if (define !== undefined && typeof define.amd) {
        environment = "requirejs";
    }
    else {
        environment = "browser";
    }

    var name = "framework-factory";

    if (module !== undefined && typeof module.exports === 'object') {
        module.exports = definition();
    }
    else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(definition);
    }
    else {
        root[name] = definition();
    }

}(function() {

    return FrameworkFactory;


}), this);