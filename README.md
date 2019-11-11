# Framework Factory

> This project has been discontinued!

Framework factory is a tiny, well-designed and yet powerful factory framework for developing modern Object Oriented JavaScript based class libraries, frameworks and applications. Its pluggable architecture and amazing combination of tools (configuration handling, read-only members, events, properties, class inheritance, and much more) gives you enough power to create robust applications which are compatible with your favorite JavaScript library (jQuery, mooTools, underscore), and your favorite platform (Modern Browsers, NodeJS).


**Following example shows how a simple farmework called _myFramework_ is created.**

Create a new Framework called myFramework through _FrameworkFactory.create_
function. This function accepts configuration object.

```js
var myFramework = FrameworkFactory.create({
    name: "myFramework",
    version: "1.0.0"
});
```

Create new class called Person within myFramework namespace.

```js
myFramework.Person = myFramework.Class({

    //An attribute called firstName with default value first-name.
    firstName: myFramework.attribute("first-name"),

    //An attribute called lastName with default value last-name.
    lastName: myFramework.attribute("last-name"),

    //A readonly field fullName which returns fullName. Readonly fields
    //can not be changed directly.
    fullName: myFramework.readonly({
        get: function () {
            return this.firstName + " " + this.lastName;
        }
    }),

    //Represents an event which is fired when person starts working.
    start: myFrmaework.event();

    //Person starts working
    work: function () {
        this.trigger("start");
    }

});

```

Create another class called _myFramework.Employee_ which is derived from
_myFramework.Person_.


```js
myFramework.Employee = myFramework.Person.extend({

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

    //Constructor function, initializes the new instance of
    //myFramework.Employee
    init: function (employeeCode) {

        if (employeeCode) {
            //Initialize an existing employee
            this.employeeCode = employeeCode;
        }
        else {
            throw new Error("Invalid employeeCode");
        }
    },

    //Employee starts working.
    work: fuction() {
        console.log("Employee started working.");

        //Call base class' work function, which will fire "start" event.
        this.base();
    }

});

```

Some applications of dummy framework myFramework.

```js
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

##Licence and Copyright ##

&copy; 2011-2017 Maniar Technologies Private Limited, MIT license
