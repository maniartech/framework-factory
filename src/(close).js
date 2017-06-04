
// CommonJS (Node)
if (typeof module !== "undefined" && typeof module.exports === "object") {
    module.exports = FrameworkFactory;
}
// AMD (RequireJS)
else if (typeof define !== "undefined" && typeof define.amd === "object") {
    define(function() {
        return FrameworkFactory;
    });
}
else {
    root.FrameworkFactory = FrameworkFactory;
}

return FrameworkFactory;

})(this);