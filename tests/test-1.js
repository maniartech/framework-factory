var eq = strictEqual;
var neq = notStrictEqual;
var source, tests, i, iLen;

sources = [ ];

tests = [
    ,
    'order!tests/test-frameworks/component-lib',
    'order!tests/properties',
    'order!tests/observables'
];

//for (i=0, iLen=tests.length; i<iLen; i+=1) {tests[i] = "order!tests/" + tests[i];}

require({
    urlArgs: Number(new Date()),
}, ['order!../lib/framework-factory'], function (FrameworkFactory) {

    window.FrameworkFactory = FrameworkFactory;

    require({
        urlArgs: Number(new Date()),
    }, tests);

});
