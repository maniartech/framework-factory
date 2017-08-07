
function plugin(FrameworkFactory) {

    //Register plugin with FrameworkFactory. Registration enables plugin's load function
    //to be invoked each time a new framework is created.
    FrameworkFactory.plugins.register({
        /**
         * The name of the plugin, mandatory.
         */
        name: "MyPlugin"

        /**
         * The plugin version.
         */
        version: "1.0",

        /**
         * The plugin author.
         */
        author: "Your Name",

        /**
         * The plugin url.
         */
        url: "http://www.ff-plugin.com",

        /**
         * Called when a new framework ($f) is created
         * @function load
         * @param  {[type]} $f The new framework.
         */
        load: function ($f) {
            // TODO: Code to attach framework related code goes here.
            // Example:
            // $f.myPluginFunction = function(){...}
        }
    });
}

