

$requre.fromRoot('baseobject', 'a', 'b');
$require()


$class
$interface
$require
$static
$property
$method

//Require usages

$requre('abc', 'xyz', 'wow')
    .onSuccess(function(){
        //dependencies loaded
    })
    .onError(function(){
        //error occured
    });

$require({
    //Parametarized require
})

var IPerson = $interface({
    eyes: [],
    walk: function() {}
});