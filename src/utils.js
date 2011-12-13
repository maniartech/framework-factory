

    _framework.Check = {
        isFunction: function(fn) {

        }
    };

    function getPrivateKey (key) {
        return '_' + key;
    }

    //makes console.log more safe.
    var console = global.console || function(){

        function emptyFn() {};
        var functions = 'assert,count,debug,dir,dirxml,error,exception,group,' +
                        'groupCollapsed,groupEnd,info,log,timeStamp,profile,' +
                        'profileEnd,time,timeEnd,trace,warn'.split(',');
        var con = {};
        for(var i=0, len=functions.length; i<len; i++) {
            con[functions[i]] = emptyFn;
        }
    };
