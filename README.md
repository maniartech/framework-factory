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

    department: myFramework.readonly(),

    //Define employeeCode property which sets the department
    //info based on its value.
    employeeCode: myFramework.property({
        get: function () {
            return this._employeeCode;
        },
        set: function(v) {
            if (v !== this._employeeCode) {
                this._employeeCode = v;
                if (employeeCode < 100) {
                    this._department = "Sales";
                }
                else {
                    this._department = "Marketing";
                }

                //Load other properties like firstName, lastName etc from database.
            }
        }
    }),

    //Create an event which is fired when employee is join.
    start: myFrmaework.event();

    init: function (employeeCode) {

        if (employeeCode) {
            //Initialize an existing employee
            this.employeeCode = employeeCode;
        }
        else {
            throw new Error("Invalid employeeCode");
        }
    },

    work: fuction() {
        this.trigger("start");
        //Do work
    }

}, myFramework.Person);

```

Some applications of dummy framework myFramework.

```

var p1 = new myFramework.Person();
p1.firstName = "Peter";
p1.lastName = "Parker";
console.log(p1.fullName); //Prints Peter Parker

p1.fullName = "Peter Thompson"; //Can't set read-only properties

var e1 = new myFramework.Employee(10);
console.log(e1.employeeCode); //Prints 10
console.log(e1.department); //Prints Sales
console.log(e1 instanceof Employee) //Prints true
console.log(e1 instanceof Person) //Prints true
console.log(e1.fullName); //Prints the fullName loaded from the database.

```


## Under Development ##
FrameworkFactory is currently under development we are planning to releast first version during April 2013.

##Licence and Copyright ##

© 2011-2013 Maniar Technologies Private Limited, MIT license
