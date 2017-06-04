
/**
 * Provides the environment tests in which FrameworkFactory or associated frameworks are
 * currently running. Useful for checking whether current environment is Node, Browser or RequireJS.
 *
 * @field {Object}
 *
 * @public
 * @version 1.0
 */
FrameworkFactory.environment = (function (){

    function Environement() {

        /**
         * Returns `true` if code is running under commonJS environment such as Node otherwise `false`.
         *
         * @field { boolean } Returns `true` if framework factory is executing under the NodeJS environment otherwise
         * `false`.
         *
         * @public
         * @version 1.0
         **/
        this.commonJS = typeof module !== "undefined" && typeof module.exports === "object";

        /**
         * Returns whether code is running under the AMD environment such as RequireJS or not.
         *
         * @field { boolean } Returns `true` if RequireJS environment is detected otherwise
         * `false`.
         *
         * @public
         * @version 1.0
         **/
        this.amd = typeof define !== "undefined" && typeof define.amd === "object";

        /**
         * Returns whether code is running withing browser or not.
         *
         * @field { boolean } Returns `true` if framework factory is executing under the Browser environment otherwise
         * `false`.
         *
         * @public
         * @version 1.0
         **/
        this.browser = typeof window !== "undefined" && typeof window.document === "object";

    }

    return new Environement();

})();