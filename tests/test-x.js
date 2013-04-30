var eq = strictEqual;
var neq = notStrictEqual;
var source, tests, i, iLen;

sources = [ "order!../lib/framework-factory-x.js"];

tests = [
    'test-frameworks/component-lib',
    'properties',
    'observables'
];

for (i=0, iLen=tests.length; i<iLen; i+=1) {tests[i] = "order!tests/" + tests[i];}
require({urlArgs: Number(new Date())}, sources.concat(tests));