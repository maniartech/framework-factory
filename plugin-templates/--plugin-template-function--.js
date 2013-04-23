
function main(FrameworkFactory) {

    /**
     * Called when a new framework ($f) is created
     * @function myPlugin
     * @param  {[type]} $f The new framework.
     */
    function myPlugin($f) {
        // TODO: Code to attach framework related code goes here.
        // Example:
        // $f.myPluginFunction = function(){...}
    }

    //Optional information.

    /**
     * The plugin version.
     * @field {String} version
     */
    myPlugin.version = "1.0";

    /**
     * The plugin author.
     * @field {String} author
     */
    myPlugin.author = "Your Name";

    /**
     * The plugin url.
     * @field {String} url
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
