$(function() {
    var superInst;

    module( "Class hierarchy" );

    test( "Superclass superclass", function() {
        equal( typeof SuperClass.superclass, 'undefined', 'superclass has no superclass' );
    } );

    test( "SubClass superclass", function() {
        equal( SubClass.superclass, SuperClass, 'superclass correctly set up' );
    } );

    module( "Class with no super", {
        setup: function() {
            superInst = Class.create( SuperClass );
        }
    } );

    test( "Class with no superclass is good", function() {
        ok( superInst instanceof SuperClass, 'created' );
    } );

    test( 'constructor good', function() {
        equal( superInst.constructor, SuperClass, 'constructor good' );
    } );

    test( "toString", function() {
        equal( superInst.toString(), "SuperClass checking in." );
    } );

    test( "addANumber", function() {
        equal( superInst.addANumber( 5 ), 15, "addANumber good" );
    } );


    var subInst;

    module( "Class with super", {
        setup: function() {
            subInst = Class.create( SubClass );
        }
    } );

    test( 'SubInst is created', function() {
        ok( subInst instanceof SubClass, 'SubInst created' );
    } );

    test( 'constructor good', function() {
        equal( subInst.constructor, SubClass, 'constructor good' );
    } );

    test( 'toString', function() {
        equal( subInst.toString(), "SubClass and SuperClass checking in." );
    } );

    test( 'addANumber', function() {
        equal( subInst.addANumber( 5 ), 20, "Add a number working properly" );
    } );

    var subsubInst;

    module( "Class with 2 supers", {
        setup: function() {
            subsubInst = Class.create( SubSubClass );
        }
    } );

    test( 'toString', function() {
        equal( subsubInst.toString(), 'Sub Class of SubClass and SuperClass checking in.' );
    } );

    test( 'calling all kinds of internals', function() {
        equal( subsubInst.whack(), 'Sub Class of SubClass and SuperClass checking in. 17' );
    } );
} );

