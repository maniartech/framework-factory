module("plugin infrastructure");

test('Plugins Tests', function() {

    function myPlugin($f, config) {
        $f.echo = function echo(val) {
            return  val;
        }
    };

    myPlugin.info = {
        name: 'myPlugin'
    };

    eq (typeof FrameworkFactory.plugins, 'object');
    FrameworkFactory.plugins.register(myPlugin);

    var myFramework = FrameworkFactory.create('myFramework');
    neq (FrameworkFactory.plugins.getNames().indexOf('myPlugin'), -1);
    neq (FrameworkFactory.plugins.toArray().indexOf(myPlugin), -1);
    neq (myFramework.echo, undefined);
    eq (myFramework.echo('wow'), 'wow');
});