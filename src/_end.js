
    FrameworkFactory.plugin = function(fn) {
        fn.call(global, $f);
    }
    
    return FrameworkFactory;

})(this);

//$class = framework.classCreator;
//$interface = framework.interfaceCreator;
//$property = baseObject