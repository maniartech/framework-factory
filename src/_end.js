
    /**
     * Associate plugin for the framework to be created.
     * @param fn Callback which is invoked with praposed framework prototype instance
     * as an argument. The keyword 'this' refers to the 'global' object. 'HtmlWindow' in
     * browser based applications.
     * @public
     * @function
     * @example
     *  FrameworkFactory.plugin(function(framework){
            var global = this,
                //The Load plugin function
                framework.load = framework.load || function() {
                    //Code to initialize load plugin goes hear.
                    //...
                };
        });
     **/
    FrameworkFactory.plugin = function (fn) {
        fn.call(global, $f);
    };

    return FrameworkFactory;

})(this);