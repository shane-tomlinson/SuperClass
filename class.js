if( !Function.prototype.curry ) {
    Function.prototype.curry = function() {
            var fn = this, args = Array.prototype.slice.call(arguments);
            return function() {
                    return fn.apply(this, args.concat(
                          Array.prototype.slice.call(arguments)));
            };
    };
}

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

    // This takes care of when the user calls "this.super()"
    // The initial call to the decorator and each call to this.super
    // sets up currLevel to point to the function that should
    // be run next.
    function _super( key, level ) {
        var info = findNext( key, level ),
            retval;

        if( info.next ) {
            this.super = _super.bind( this, key, info.level );
            var args = [].slice.call( arguments, 2 );
            retval = info.next.apply( this, args );

            this.super = null;
            delete this.super;
        }

        return retval;
    }

    function findNext( key, level ) {
        var next;
        do {
            next = level && level.prototype.hasOwnProperty( key
                    ) && level.prototype[ key ];
            level = level.superclass;
        } while( level && !next );
        return { next: next, level: level };
    }

    if( !constr.wrapper ) {
        var overridden = {};
        for( var key in constr.prototype ) {
            if( typeof constr.prototype[ key ] === 'function' && key !== 'constructor' ) {
                overridden[ key ] = _super.curry( key, constr );
            }
        }

        constr.wrapper = Class( constr, overridden );

    }

    var obj = new constr.wrapper();
    obj.constructor = constr;

    return obj;
}

