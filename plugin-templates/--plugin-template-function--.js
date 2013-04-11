
function main(FrameworkFactory) {

    /**
     * Called when a new framework ($f) is created
     * @param  {[type]} $f The new framework.
     */
    function myPlugin($f) {

    }

    //Optional information.

    /**
     * The plugin version.
     * @field {String}
     */
    myPlugin.version = "1.0";

    /**
     * The plugin author.
     * @type {String}
     */
    myPlugin.author = "Aamir Maniar";

    /**
     * The plugin url.
     * @type {String}
     */
    myPlugin.url = "http://www.ff-plugin.com";

    //Register plugin with FrameworkFactory. Registration enables plugin's function
    //to be invoked each time a new framework is created.
    FrameworkFactory.plugins.register(myPlugin);
}

//Load environment
if (typeof module !== "undefined" && typeof module.exports === "object") {
    module.exports = main;
}
else {
    main(this.FrameworkFactory);
}
