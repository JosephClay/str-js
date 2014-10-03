(function(name, definition) {

    if (typeof define === 'function') { // RequireJS
        define(function() { return definition; });
    } else if (typeof module !== 'undefined' && module.exports) { // CommonJS
        module.exports = definition;
    } else { // Browser
        this[name] = definition;
    }

})('str', function(Array, Object, undefined) {

    var _store = {},

        _warn = function(name) {
            console.warn('str-js: string does not exist at location: "' + name + '".');
        },

        _slice = (function(slice) {

            return function(obj) {
                return slice.call(obj);
            };

        }(Array.prototype.slice)),

        _hasSize = function(obj) {
            if (!obj) { return false; }
            for (var key in obj) { return true; }
            return false;
        },

        _toString = Object.prototype.toString,

        _isObject = function(obj) {
            var type = typeof obj;
            return !!obj && (type === 'function' || type === 'object');
        },

        _isArray = Array.isArray || function(obj) {
            return _toString.call(obj) === '[object Array]';
        },

        _isString = function(obj) {
            return _toString.call(obj) === '[object String]';
        },

        _isNumber = function(obj) {
            return _toString.call(obj) === '[object Number]';
        },

        _exists = function(obj) {
            return obj !== null && obj !== undefined;
        },

        _extend = function(obj) {
            if (!_isObject(obj)) { return obj; }

            var args = arguments,
                idx = 1,
                length = args.length,
                source,
                prop;
            for (; idx < length; idx++) {
                source = args[idx];
                if (source) {
                    for (prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            }

            return obj;
        };

    var Str = function(qty) {
        this.qty = qty;
    };
    Str.prototype = {
        extend: function(obj) {
            _extend(_store, obj);
        },

        print: function(name, firstParam) {
            var args = arguments,
                str = _get(name, this.qty),
                result;

            this.qty = null;

            // Formatting can be done by passing
            // a named object as a parameter
            if (_isObject(firstParam)) {
                result = _formatViaObject(str, firstParam);
                if (_hasSize(Api.globals)) { result = _formatViaObject(result, Api.globals); }
                return result;
            }

            // Or an array of parameters
            if (_isArray(firstParam)) {
                result = _formatViaArray(str, firstParam);
                if (_hasSize(Api.globals)) { result = _formatViaObject(result, Api.globals); }
                return result;
            }

            // Or as normal parameters (the arguments)
            var argsArr = _slice(args);
            argsArr.shift();
            result = _formatViaArray(str, argsArr);
            if (_hasSize(Api.globals)) { result = _formatViaObject(result, Api.globals); }
            return result;
        },

        get: function(name) {
            return _get(name, this.qty);
        },

        toString: function() {
            return JSON.stringify(_store);
        },

        toJSON: function() {
            return _store;
        }
    };

    var Api = _extend(function(qty) {
        return new Str(qty);
    },
    Str.prototype,
    {
        globals: {},
        delimiter: '.'
    });

    var _rStore = (function() {

        var regexes = {};

        return {
            get: function(key) {
                return regexes[key] || (regexes[key] = new RegExp('{'+ key +'}', 'g'));
            }
        };

    }());

    /*
        If the location of the name passed is a string, that will always be used.
        For plural the string stack is: plural, singular, def
        For singular the string stack is: singular, def
    */
    var _get = function(name, qty) {
        // Transverse the _store to find the named string
        var loc = _store,
            chain = name.split(Api.delimiter),
            idx = 0,
            length = chain.length;
        for (; idx < length; idx++) {
            name = chain[idx];
            if (loc === undefined) { continue; }
            loc = loc[name];
        }

        if (!_exists(loc)) {
            _warn(name);
            return '';
        }

        // If the loc is a string, qty doesn't matter
        if (_isString(loc)) {
            return loc;
        }

        var result;
        // plur string stack
        qty = !_exists(qty) ? 1 : !_isNumber(qty) ? 1 : qty;
        if (qty === 0 || qty > 1) {
            result = loc.plur || loc.sing || loc.def || null;
            if (result === null) { _warn(name); }
            return result || '';
        }

        // sing string stack
        result = loc.sing || loc.def || null;
        if (result === null) { _warn(name); }
        return result || '';
    };

    var _formatViaArray = function(str, arr) {
        var len = arr.length,
            idx = len - 1;

        if (!len) { return str; }

        while (idx--) {
            str = str.replace(_rStore.get(idx), arr[idx]);
        }
        return str;
    };

    var _formatViaObject = function(str, props) {
        var key;
        for (key in props) {
            str = str.replace(_rStore.get(key), props[key]);
        }
        return str;
    };

    return Api;

}(Array, Object));