function Class( superclass, subclass ) {
    if( !subclass ) {
        subclass = superclass;
        superclass = null;
    }

    // F is our new class constructor, it does nothing.  Absolutely nothing.
    var F = function() {};
    if( superclass ) {
        // If there was a superclass, set our new classes prototype to it.
        F.prototype = new superclass();
        for( var key in subclass ) {
            // copy over subclass properties to new prototype.
            F.prototype[ key ] = subclass[ key ];
        }

        // A very very important bit of housekeeping here, keep track of
        // the superclass.  This is used later.
        F.superclass = superclass;
    }
    else {
        // no superclass, just set the prototype to be the subclass object.
        F.prototype = subclass;
    }

    // very important to reset the constructor as any class with a superclass
    // will have it overwritten
    F.prototype.constructor = F;

    return F;
}

// The creation function.  Called like: Class.create( constructor_to_use );
Class.create = function( constr ) {
    var obj = new constr();

    // No wrapping on base class instances.
    if( !obj.constructor.superclass ) {
        return obj;
    }

    // There is one set of handlers created for each object.  This allows us to
    // manage the call stack/prototype chain for every function call in the
    // chain.  Because these functions are created once for each object, it
    // is less than optimal when it comes to memory usage.
    var funcDecorator = ( function( obj ) {
        var currLevel,
            currKey,
            stack = [];

        function pushStack() {
            stack.push( [ currLevel, currKey ] );
        }

        function popStack() {
            var level = stack.splice( stack.length - 1, 1 );
            currLevel = level[ 0 ];
            currKey = level[ 1 ];
        }

        // The initial decorator function, this function decorates
        // every front facing function created whenever the object
        // is created using Class.create.  When the function is called,
        // two variables, currLevel and currKey are set up to keep track
        // of where in the prototype chain we are currently and which
        // funciton needs called.  When entering the function, push
        // the current key/level info on the stack so that when we
        // finish, the state is back to where it originally was.
        // currLevel, currKey are not unique to each function call,
        // but are unique to each object.  This means we have to keep
        // the state appropriately.
        function decorator( key ) {
            return function() {
                pushStack();

                // currKey and currLevel point at our current function
                // at the constructor.
                currKey = key;
                currLevel = obj.constructor;

                obj.super = _super;

                var next = findNext(),
                    retval = next.apply( obj, arguments );

                obj.super = null;
                delete obj.super;

                popStack();

                return retval;
            };
        }

        // This takes care of when the user calls "this.super()"
        // The initial call to the decorator and each call to this.super
        // sets up currLevel to point to the function that should
        // be run next.
        function _super() {
            pushStack();

            var next = findNext(),
                retval;

            if( next ) {
                retval = next.apply( obj, arguments );
            }

            popStack();

            return retval;
        };

        function findNext() {
            var next;
            do {
                next = currLevel && currLevel.prototype.hasOwnProperty( currKey
                        ) && currLevel.prototype[ currKey ];
                currLevel = currLevel.superclass;
            } while( currLevel && !next );
            return next;
        }

        return decorator;
    }( obj ) );

    for( var key in obj.constructor.prototype ) {
        var item = obj[ key ];
        // note, there is NO hasOwnProperty.  We want to iterate through
        // ALL of the Class' top level functions.  We are decorating
        // each function with out own that sets up the call stack management
        // routine.  Note, we do not wrap the constructor.  This is so that we
        // can do instanceof correctly.
        if( typeof item === 'function' && key !== 'constructor' ) {
            obj[key] = funcDecorator( key );
        }
    }


    return obj;
}

