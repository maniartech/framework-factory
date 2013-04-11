var FrameworkFactory = require("../../lib/framework-factory");
require("./plugin.js")(FrameworkFactory);

var x = FrameworkFactory.create("myFramework");
console.log(x);