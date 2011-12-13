
    var _members = {};

    /*
     * @class A factory class which creates the base framworks for you.
     * */
    var FrameworkFactory = function() {

        /*
         * @field Version of the framework factory.
         *
         * */
        version: '1.0.0',

        /*
         * @function A factory function to create framework root based on spplied options.
         * @param options which help define the behaviour of the framework.
         *
         * */
        create: function(options) {

            var rootNamespace = options.root || 'framework';
            var framework = {};

            framework.Class = $class;
            framework.version = options.version || '1.0.0';
            framework.fullname = options.fullName || 'framework';


            for (var key in _members) {
                if (_members.hasOwnProperty(key)) {
                    framework[key] = _members[key];
                }
            }
