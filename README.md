#Framework Factory#

Framework factory is a tiny, well-designed and yet powerful factory framework for developing modern Object Oriented JavaScript based class libraries and applications. Its pluggable architecture and amazing combination of tools (configuration handling, read-only members, events, properties, class inheritance, and much more) gives you enough power to create robust applications which are compatible with your favorite JavaScript library (jQuery, mooTools, underscore), your favorite platform (Modern Browser, NodeJS) and your favorite language (JavaScript, CoffeeScript and TypeScript).

**Example:**

Following example shows how is a simple farmework called _myFramework_ created.

```

//Create a new Framework called myFramework through FrameworkFactory.create
//function. This function accepts configuration parameter
var myFramework = FrameworkFactory.create({
    name: "myFramework",
    version: "1.0.0"
});
```

Create new class called Person within myFramework namespace.


```
myFramework.Person = myFramework.Class({

    //Cretes a new attribute called name with default value first-name.
    firstName: myFramework.attribute("first-name"),

    //Cretes a new attribute called name with default value last-name.
    lastName: myFramework.attribute("last-name"),

    //Create a
    fullName: myFramework.readonly({
        get: function () {
            return this.firstName + " " + this.lastName;
        }
    })

});

```

Create another class called _myFramework.Employee_ which is derived from
_myFramework.Person_.

```

myFramework.Employee = myFramework.Class({

    //Readonly properties can not be set.
    employeeCode: myFramework.readonly();

    //Create an event which is fired when employee is join.
    join: myFrmaework.event();

}, myFramework.Person);

```


## Under Development ##
FrameworkFactory is currently under development we are planning to releast first version during April 2013.

##Licence and Copyright ##

© 2011-2013 Maniar Technologies Private Limited, MIT license
