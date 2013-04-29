var eq = strictEqual;
var neq = notStrictEqual;
var source, tests, i, iLen;

sources = [ "order!../lib/framework-factory.js"];

tests = [
    'test-frameworks/membership-lib',
    'core',
    'is',
    'classes',
    'attributes',
    'events'
];

for (i=0, iLen=tests.length; i<iLen; i+=1) {tests[i] = "order!tests/" + tests[i];}
require({urlArgs: Number(new Date())}, sources.concat(tests));