var source, tests, i, iLen;

sources = [
    'pollyfills.js',
    'core.js',
    'is.js',
    'classes.js',
    'attributes.js',
    'events.js',
    'properties.js',
    'observables.js',
    'plugins/utils'
];

tests = [
    'support',
    'core',
    'events',
    'test'
];

for (i=0, iLen=sources.length; i<iLen; i+=1) {sources[i] = "order!../src/" + sources[i];}
for (i=0, iLen=tests.length; i<iLen; i+=1) {tests[i] = "order!tests/" + tests[i];}
require({urlArgs: Number(new Date())}, sources.concat(tests));