
/*
 * @function: Facilitates the creation of interface using this shortcut method.
 * @param: Accepts variable number of function names in string. Implementing class
 *         must implement these functions.
 * */
var $interface = function $interface() {

    var args = arguments,
        interfaceObj = {},
        members = [],
        member, i, len;

    for (i=0, len = args.length; i<len; i++) {
        member = args[i];
        if (typeof member === 'string') {
            members.push(member);
        }
    }

    /*
     * @field: Holds list of all the members defined in the interface.
     * */
    interfaceObj.members = members;

    /*
     * @function: Validates the object to check whether object defines all the
     *            members defined in inteface or not.
     * @param   :
     * @returns : Returns true, if obj is found with all the members defined in
     *           interface, else false.
     *
     * */
    interfaceObj.validate = function validate(obj) {
        for (i=0, len = members.length; i<len; i++) {
            member = member[i];
            if (obj[member] === undefined) {
                return false;
            }
        }
        return true;
    };

}

global.$interface = $interface;
/*
 * @Inteface: Defines the drawable interface, which allows
 * */
var Drawable = $interface("draw", "refresh");


var webdoodling = $package('webdoodling');
