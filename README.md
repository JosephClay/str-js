str-js
=========

`npm install str-js`

A simple string store with nesting, singular and plural selection, and string formating.

Call `str.print('with.delineated.keys');` and str will return the formatted string. If you
dont want to use ".", a different delimiter can be set with `str.delimiter = '_';`.

Strings can be added to the str-js at anytime by calling `str.extend({ the_new: 'strings' });`

#Basic Example

```js
str.extend({
    foo: {
        bar: 'hello',
        baz: {
            plur: 'worlds',
            sing: 'world'
        }
    }
});

str.print('foo.bar'); // => 'hello'
str.print('foo.baz'); // => 'world'
str(3).print('foo.baz'); // => 'worlds'
str.print('does_not_exist'); // => ''
```

#Example with Formatting

```js
str.extend({
    foo: {
        via_arguments: 'hello {0}',
        via_array: 'hello {0}',
        via_object: 'hello {place}'
    }
});

// all print 'hello world'
str.print('foo.via_arguments', 'world');
str.print('foo.via_array', 'world');
str.print('foo.via_object', { place: 'world' });

str.globals = { place: 'other world' };
str.print('foo.via_object'); // => 'hello other world'
```