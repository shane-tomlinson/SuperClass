/*global test, equal, ok, Class */

(function() {
    var SuperClass = Class( {
        toString: function() {
             return 'SuperClass checking in.';
        },

        addANumber: function( start ) {
             return start + 10;
        }
    } );

    var SubClass = Class( SuperClass, {
        toString: function() {
            return 'SubClass and ' + this.super();
        },

        addANumber: function( start ) {
             return this.super( start + 5 );
        }
    } );

    var SubSubClass = Class( SubClass, {
        toString: function() {
            return 'SubSubClass';
        },

        whack: function() {
           return this.toString() + ' ' +  this.addANumber( 2 );
        }
    } );

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
        equal( subsubInst.toString(), 'SubSubClass' );
    } );

    test( 'calling all kinds of internals', function() {
        equal( subsubInst.whack(), 'SubSubClass 17' );
    } );

    module( "Two objects at once", {
        setup: function() {
            subInst = Class.create( SubClass );
            subsubInst = Class.create( SubSubClass );
        }
    } );

    test( 'toString on both works correctly', function() {
        equal( subsubInst.toString(), 'SubSubClass' );
        equal( subInst.toString(), 'SubClass and SuperClass checking in.' );
    } );
}() );

