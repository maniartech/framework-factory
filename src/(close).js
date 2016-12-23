
if (FrameworkFactory.environment.commonJS) {
    module.exports = FrameworkFactory;
}
else if (FrameworkFactory.environment.amd) {
    define(function() {
        return FrameworkFactory;
    });
}
else {
    root.FrameworkFactory = FrameworkFactory;
}

return FrameworkFactory;

})(this);