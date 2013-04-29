
//Tests loading of FrameworkFactory in node environment.

var assert = require("assert"),
    FrameworkFactory = require("../lib/framework-factory-x.js");


assert.notEqual(FrameworkFactory, undefined, "FrameworkFactory should not be undefined");

var myFramework = FrameworkFactory.create({
    name: "myFramework",
    version: "1.1.0"
});

assert.notEqual(myFramework, undefined, "myFramework should not be undefined");
assert.equal(myFramework.name, "myFramework");
assert.equal(myFramework.version, "1.1.0");

console.log(myFramework);
console.log("All assertions passed successfully.");
