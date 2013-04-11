
function main(FrameworkFactory) {

    var plugin = {

        /**
         * The plugin name.
         * @field {String}
         */
        name: "my-plugin",

        /**
         * The plugin version.
         * @field {String}
         * @optional
         */
        version: "1.0",

        /**
         * The plugin author.
         * @type {String}
         * @optional
         */
        author: "Aamir Maniar",

        /**
         * The plugin url.
         * @type {String}
         * @optional
         */
        url: "http://www.ff-plugin.com",

        /**
         * Called when a new framework ($f) is created
         * @param  {[type]} $f The new framework.
         */
        load: function ($f) {
            //TODO: Code to attach framework related code goes here.
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
