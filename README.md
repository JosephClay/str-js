str-js
=========

`npm install str-js`

A string store with nesting, singular and plural selection, and string formating.

Call `str.print('with.delinkeys');` and str will return the formatted string.

Strings can be added to the str-js at anytime by calling `str.extend({ the_new: 'strings' });`

#Example

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