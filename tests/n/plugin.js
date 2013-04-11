
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
         */
        version: "1.0",

        /**
         * The plugin author.
         * @type {String}
         */
        author: "Aamir Maniar",

        /**
         * The plugin url.
         * @type {String}
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

    FrameworkFactory.plugins.register(plugin);

    return plugin;
}

//Load environment
if (typeof module !== "undefined" && typeof module.exports === "object") {
    module.exports = main;
}
else {
    main(this.FrameworkFactory);
}


