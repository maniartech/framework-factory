
function main(FrameworkFactory) {

    var plugin = {

        /**
         * The plugin name.
         * @field {String} name
         */
        name: "my-plugin",

        /**
         * The plugin version.
         * @field {String} version
         * @optional
         */
        version: "1.0",

        /**
         * The plugin author.
         * @field {String} author
         * @optional
         */
        author: "Your Name",

        /**
         * The plugin url.
         * @field  {String} url
         * @optional
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
    };

    //Register plugin with FrameworkFactory. Registration enables plugin's load function
    //to be invoked each time a new framework is created.
    FrameworkFactory.plugins.register(plugin);
}

//Load environment
if (typeof module !== "undefined" && typeof module.exports === "object") {
    module.exports = main;
}
else {
    main(this.FrameworkFactory);
}
