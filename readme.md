# dale

> "Don't write that stuff until you've tried to live without it and fully understand why you need it." -- [James Hague](http://prog21.dadgum.com/187.html)

dale is a tool for iterating over arrays, objects and other values. Why did I write this instead of using [underscore](https://github.com/jashkenas/underscore) or [lodash](https://github.com/lodash/lodash)? Well, because I want a very small library that only contains the looping constructs that I always need, no more.

Small as it is, dale is superior to writing `for (var a in b)` in the following respects:

1. It can iterate an input that's neither an array nor an object - this input is interpreted as being an array with one element - except that when it is `undefined`, it will be interpreted as an empty array.

   ```javascript

   [1, 2, 3]          // interpreted as [1, 2, 3]

   {a: 1, b: 2, c: 3} // interpreted as {a: 1, b: 2, c: 3}

   []                 // interpreted as []

   {}                 // interpreted as {}

   'hola!'            // interpreted as ['hola!']

   3                  // interpreted as [3]

   null               // interpreted as [null]

   undefined          // interpreted as []

   ```

2. Array iterator variables (the `a` in `for (var a in b)`) are numbers instead of strings, so you don't have to remember to use `parseInt` to do math with the iterator.

   ```javascript

   var input = ['a', 'b', 'c'];

   for (var i in input) {
      console.log ('Element #' + (i + 1) + ' is ' + input [i]);
   }

   // This loop will print:
   //    Element #01 is a
   //    Element #11 is b
   //    Element #21 is c

   dale.do (input, function (v, k) {
      console.log ('Element #' + (k + 1) + ' is ' + v);
   });

   // This function will print:
   //    Element #1 is a
   //    Element #2 is b
   //    Element #3 is c

   ```

   This also is the case for `arguments` pseudo-arrays:

   ```javascript
   var argumentsTest = function (A, B, C) {
      dale.do (arguments, function (v, k) {
         console.log ('Element #' + (k + 1) + ' is ' + v);
      });
   }

   // The function invocation below will print:
   //    Element #1 is a
   //    Element #2 is b
   //    Element #3 is c

   argumentsTest ('a', 'b', 'c');
   ```

3. Provides functions (`stop` and `stopNot`) that allow you to exit the loop prematurely if a certain value is returned by an iteration. This allows for code that's more clear as well as more efficient.

   ```javascript

   var input = [1, 2, 'clank', 4];

   var output = [];

   for (var i in input) {
      if (typeof (input [i]) !== 'number') break;
      else output.push (input [i] * 10);
   }

   // output will be [10, 20]

   output = [];

   dale.stop (input, false, function (v, k) {
      if (typeof (v) !== 'number') return false;
      else output.push (v * 10);
   });

   // output will be [10, 20]

   ```

4. When iterating an object, by default dale will only take into account the keys that are not inherited. This means that when iterating objects you never again have to do a `hasOwnProperty` check. This default can be overriden [by passing an extra argument](https://github.com/fpereiro/dale#inherited-properties).

5. It is functional, so you can invoke dale functions within object literals to generate parts of them in a very compact and elegant way. This is probably the greatest advantage of them all.

   ```javascript

   var data = {
      key: 'value',
      key2: [1, 2, 3],
      key3: dale.do ([1, 2, 3, 4], function (v) {
         return v * 10;
      })
   }

   // data.key3 will be equal to [10, 20, 30, 40]

   ```

## Installation

dale is written in Javascript. You can use it in the browser by sourcing the main file.

```html
<script src="dale.js"></script>
```

Or you can use this link to the latest version - courtesy of [RawGit](https://rawgit.com) and [MaxCDN](https://maxcdn.com).

```html
<script src="https://cdn.rawgit.com/fpereiro/dale/81569fa1077d7641a216d987a7a95a7251c62b68/dale.js"></script>
```

And you also can use it in node.js. To install: `npm install dale`

## Functions

dale consists of seven functions.

### `dale.do`

`dale.do`, for vanilla iteration:
   - Takes an `input` and a `function`.
   - For each `element` in the `input`, it executes the `function`, passing the `element` and the `key` of the element as arguments and pushes the result into an `output` array.
   - Returns the `output` array.
   - Returns an array where each element is the result of each `function` application.

```javascript

dale.do ([1, 2, 3], function (v) {return v + 1})
// returns [2, 3, 4]

dale.do ({a: 1, b: 2, c: 3}, function (v) {return v + 1})
// returns [2, 3, 4]

dale.do (1, function (v) {return v + 1})
// returns [2]

dale.do ({a: 1, b: 2, c: 3}, function (v, k) {return k + v})
// returns ['a1', 'b2', 'c3']

```

Notice that `dale.do` always returns an array with zero or more elements. It will only return an array of zero elements if its `input` is either an empty object, an empty array, or `undefined`.

```javascript

dale.do ([], function (v, k) {return v + 1})
// returns []

dale.do ({}, function (v, k) {return v + 1})
// returns []

dale.do (undefined, function (v, k) {return v + 1})
// returns []

```

### `dale.fil`

`dale.fil`, for iteration that filters out some results:
   - Takes an `input`, a `filterValue` and a `function`.
   - Just like `dale.do`, it iterates over the `input`. If the result of this application is **not** equal to the `filterValue`, it is pushed onto the `output` array.
   - Returns the `output` array.

```javascript

dale.fil ([{id: 1}, {id: 8}, {id: 14}], undefined, function (v) {
   if (v.id < 10) return v;
});
// returns [{id: 1}, {id: 8}]

var members = [
   {name: 'Pepe', active: true},
   {name: 'Dimitri', active: false},
   {name: 'Helmut', active: true}
];

dale.fil (members, undefined, function (v) {
   if (v.active) return {name: v.name};
});
// returns [{name: 'Pepe'}, {name: 'Helmut'}]

```

Notice that `dale.fil` always returns an array with zero or more elements.

### `dale.keys`

`dale.keys`, for returning the keys of an input (almost always an object):
   - Takes an `input`.
   - Applies the following `function` to the input: `function (v, k) {return k}` and pushes each result to the `output` array.
   - Returns the `output` array.

```javascript

dale.keys ({'foo': true, 'bar': false, 'hip': undefined})
// returns ['foo', 'bar', 'hip']

```

Notice that `dale.keys` always returns an array with zero or more elements (each of them the `keys` of the elements within the `input`).

### `dale.stop`

`dale.stop`, for stopping the iteration when finding a certain value:
   - Takes an `input`, a `stop value` and a `function`.
   - Just like `dale.do`, it iterates over the `input`. Two things can happen:
      - If the result of this application **is equal** to the `stop value`, the result is returned and no further iteration is performed.
      - If the result of this application **is not equal** to the `stop value`, the iteration continues.
   - If the `input` is iterated completely without finding the `stop value`, the result of the last application is returned.
   - If the `input` has zero elements (because it is an empty object, empty array, or `undefined`, `dale.stop` returns `undefined`.

This function, just like `dale.stopNot` below, has two qualities that distinguish it from the other functions:
- It can stop the iteration before reaching the end of the `input`.
- It returns a single result, instead of an array of results.

```javascript

var isNumber = function (value) {
   if (typeof (value) === 'number') return true;
   else return false;
}

dale.stop ([2, 3, 4],       false, isNumber)    // returns true
dale.stop ([2, 'trois', 4], false, isNumber)    // returns false
dale.stop ([],              true,  isNumber)    // returns undefined
dale.stop (undefined,       true,  isNumber)    // returns undefined

```

### `dale.stopNot`

`dale.stopNot` is the complementary function to `dale.stop`. The only difference is that it stops when it finds a value that is **not** equal to the comparison value (which we name `stopNot value`).

```javascript

var returnIfNotNumber = function (value) {
   if (typeof (value) === 'number') return true;
   else return value;
}

dale.stopNot ([2, 3, 4],       true, returnIfNotNumber)    // returns true
dale.stopNot ([2, 'trois', 4], true, returnIfNotNumber)    // returns 'trois'
dale.stopNot ([],              true, returnIfNotNumber)    // returns undefined

```

### `dale.obj`

`dale.obj` is like `dale.do`, but it returns an object instead. This function:
   - Always returns an object (let's name it `output`).
   - Takes an `input`, an optional `base object`, and a `function`. If a `base object` is passed that is not an object, an error will be printed.
   - For each `element` in the `input`, it executes the `function`, passing the `element` and the `key` of the element. This function application generates a `result`.
   - If `result` is an array with two elements (`result [0]` and `result [1]`), the key `result [0]` will be set to `result [1]` in either the `base object` or a new object (if no `base object` is provided).
   - If `result` is `undefined`, `output` will remain unchanged.
   - If `result` is neither an array nor `undefined`, an error will be printed and `dale.obj` will return `undefined`.

```javascript

var members = [
   {name: 'Pepe', age: 68, active: true},
   {name: 'Dimitri', age: 34, active: false},
   {name: 'Helmut', age: 42, active: true}
];

dale.obj (members, function (v) {
   if (! v.active) return;
   return [v.name, v.age];
});
// returns {Pepe: 68, Helmut: 42}

var base = {
   Fritz: 46,
   Sigfrid: 24
}

dale.obj (members, base, function (v) {
   if (! v.active) return;
   return [v.name, v.age];
});
// returns {Fritz: 46, Sigfrid: 24, Pepe: 68, Helmut: 42}

dale.obj ([], function (v) {
   return [v, v];
});
// returns {}

dale.obj (members, function (v) {
   return /thisisinvalid/
}));
// returns undefined and prints the following error: `Value returned by fun must be an array but instead is of type regex`
```

Notice that `dale.obj` always returns an object with zero or more elements, unless one of the invocations to `fun` returns an invalid value.

One important point: if you pass a `base object`, the original object will be modified. This means that if you want to preserve the original object, you must either copy it first or avoid using `dale.obj`.

```javascript

console.log (base);
// `base` will be equal to {Fritz: 46, Sigfrid: 24, Pepe: 68, Helmut: 42}

```

### `dale.times`

`dale.times` is a wrapper around the other six functions. It is basically a shorthand for creating an array with consecutive integers `[1, 2, ..., n - 1, n]` and passing it to any of the other functions - most often, `dale.do`. As such, it replaces simple while loops where you iterate through integers.

Besides `times`, which is an integer, this function receives `fun`, a string with the name of the function you wish to invoke. After these mandatory arguments, you can pass further arguments. Notice, however, that you cannot explicitly pass `input`, since that's exactly what's generated by `dale.times`.

```javascript
   // returns [2, 3, 4]
   dale.times (3, 'do', function (v) {return v + 1}));

   // returns [2, 4]
   dale.times (4, 'fil', undefined, function (v) {
      if (v % 2 === 0) return v;
   });

   // returns {1: 2}
   dale.times (2, 'obj', function (v, k) {
      if (v % 2 === 0) return [k, v];
   });

   // returns true
   dale.times (2, 'stop', false, function (v, k) {
      return v % 3 !== 0;
   });

   // returns false
   dale.times (4, 'stop', false, function (v, k) {
      return v % 3 !== 0;
   });
```

`dale.times` will return whatever is returned by the `fun` which it invokes.

## Inherited properties

By default, dale functions iterate an object, it will only iterate the keys that belong to the object directly, ignoring inherited keys.

```javascript
   var o1 = {foo: 42}
   var o2 = Object.create (o1);  // o2 inherits from o1

   dale.keys (o1); // returns ['foo']
   dale.keys (o2); // returns []

   dale.do (o1, function (v) {return v});       // returns [42]
   dale.do (o2, function (v) {return v});       // returns []
```

If you want dale functions to iterate the inherited properties of an object, pass `true` as the last argument to the function.

```javascript
   dale.keys (o2, true)                         // returns ['foo']
   dale.do (o2, function (v) {return v}, true); // returns [42]
```

## Performance

dale is necessarily slower than a `for` loop, since it consists of a functional wrapper on top of a `for` loop. Besides its features, dale's emphasis on code succintness (which is achieved by having a single variadic function generating the main loop) probably adds an extra performance hit.

The benchmark I used is included in `example.js` - to execute it just run that file, or open it in a browser. The benchmark attempts to make many iterations without almost any computation, to focus on the raw speed of the underlying loop (be it a real loop or dale's layer on top of it).

Testing different versions of node.js, Chrome and Firefox, here's some (very approximate) performance factors:

```
Iterating arrays:

for:  1x
dale: 1.5x-2.5x

Iterating objects:

for:                                    1x
dale:                                   4.5x-10x
dale, without the hasOwnProperty check: 3.5x-8x
```

This means that dale takes roughly twice when iterating arrays and up to *ten times* more time when iterating objects. Although significant, I believe this is a worthy price to pay for the ease of expression and the facilities provided by dale - especially since many of these facilities have to be inserted into the loops anyway, hence bringing down the speed of a raw `for` loop.

## Source code

The complete source code is contained in `dale.js`. It is about 100 lines long.

Below is the annotated source.

```javascript
/*
dale - v3.3.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/
```

### Setup

We wrap the entire file in a self-executing lambda function. This practice is usually named *the javascript module pattern*. The purpose of it is to wrap our code in a closure and hence avoid making our local variables exceed their scope, as well as avoiding unwanted references to local variables from other scripts.

```javascript
(function () {
```

Since this file must run both in the browser and in node.js, we define a variable `isNode` to check where we are. The `exports` object only exists in node.js.

```javascript
   var isNode = typeof exports === 'object';
```

This is the most succinct form I found to export an object containing all the public members (functions and constants) of a javascript module.

```javascript
   if (isNode) var dale = exports;
   else        var dale = window.dale = {};
```

The `type` function below is <del>copypasted</del> taken from [teishi](https://github.com/fpereiro/teishi). This is because I needed dale when writing teishi more than I needed teishi when writing dale. Thus, I decided that teishi should depend on dale. And I don't know if I can elegantly cross-reference both libraries, taking just what I need and avoiding circular dependencies.

The purpose of `type` is to create an improved version of `typeof`. The improvements are two:

- Distinguish between types of numbers: `nan`, `infinity`, `integer` and `float` (all of which return `number` in `typeof`).
- Distinguish between `array`, `date`, `null`, `regex` and `object` (all of which return `object` in `typeof`).

For the other types that `typeof` recognizes successfully, `type` will return the same value as `typeof`.

`type` takes a single argument (of any type, naturally) and returns a string with its type.

The possible types of a value can be grouped into three:
- *Values which `typeof` detects appropriately*: `boolean`, `string`, `undefined`, `function`.
- *Values which `typeof` considers `number`*: `nan`, `infinity`, `integer`, `float`.
- *values which `typeof` considers `object`*: `array`, `date`, `null`, `regex` and `object`.

If you pass `true` as a second argument, `type` will distinguish between *true objects* (ie: object literals) and other objects. If you pass an object that belongs to a class, `type` will return the lowercased class name instead.

The clearest example of this is the `arguments` object:

```javascript
type (arguments)        // returns 'object'
type (arguments, true)  // returns 'arguments'
```

Below is the function.

```javascript
   var type = function (value, objectType) {
      var type = typeof value;
      if (type !== 'object' && type !== 'number') return type;
      if (value instanceof Array) return 'array';
      if (type === 'number') {
         if      (isNaN (value))      return 'nan';
         else if (! isFinite (value)) return 'infinity';
         else if (value % 1 === 0)    return 'integer';
         else                         return 'float';
      }
      type = Object.prototype.toString.call (value).replace ('[object ', '').replace (']', '').toLowerCase ();
      if (type === 'array' || type === 'date' || type === 'null') return type;
      if (type === 'regexp') return 'regex';
      if (objectType) return type;
      return 'object';
   }
```

### The main function

All seven functions of dale have many common elements. As a result, I've factored out the common elements in the function `make` below (short for `make function`).

`make` function receives a `what` argument (can be any of `'do'`, `'obj'`, `'fil'`, `'stop'`, `'stopNot'`). It will then return the corresponding dale function.

`dale.keys` and `dale.times` are wrappers around the other functions, so the function below is actually concerned with the other five functions.

```javascript
   var make = function (what) {
      return function (input, second, third, fourth) {
```

For `dale.do`, the arguments received must be `input`, `fun` and an optional `inherit` flag, which must be `true`. We also set `output` to an empty array.

```javascript
         if      (what === 'do')              var fun = second, inherit = third  === true, output = [];
```

For `dale.fil`, the arguments received must be `input`, `middleArg` (which will be the value that must be filtered out), `fun` and an optional `inherit` flag. As with `dale.do`, we set `output` to an empty array.

```javascript
         else if (what === 'fil')             var fun = third,  inherit = fourth === true, middleArg = second, output = [];
```

The case below corresponds both to `dale.stop` and `dale.stopNot`, which receive `input`, `middleArg` (the value which must be compared to see if the loop has to stop), `fun` and an optional `inherit` flag. We define `output` to be `undefined`.

```javascript
         else if (what !== 'obj')             var fun = third,  inherit = fourth === true, middleArg = second, output;
```

If we're here, we're dealing with `dale.obj`. We will consider the case where we receive a base object between `input` and `fun`. In this case, we set `output` to the argument between `input` and `fun`. As with the cases above, we recognize the `inherit` flag.

```javascript
         else if (type (second) === 'object') var fun = third,  inherit = fourth === true, output = middleArg;
```

Finally, we consider the case where `dale.obj` doesn't receive a base object. In this case, we accept `input`, `fun`, `inherit` and initialize `output` to an empty object.

```javascript
         else                                 var fun = second, inherit = third  === true, output = {};
```

Note that every dale function (with the exception of `dale.keys` and `dale.times` which are defined as special cases outside of `make`) receives `fun` as its last required argument. This means that a boolean flag cannot be possibly confused with `fun`.

For any dale function, if the `input` is `undefined`, we return the default `output`. Notice that in this case, the function returns without executing the `fun` even once.

```javascript
         if (input === undefined) return output;
```

We check the type of the arguments. Since `input` and `middleArg` can be anything (except for the case of `dale.obj`, for which we have already checked the type of `middleArg`), we just need to check that `fun` is indeed a function.

If `fun` is not a function, we log an error and return `false`.

```javascript
         if (type (fun) !== 'function') {
            console.log (((what === 'do' || (what === 'obj' && type (second) !== 'object')) ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }
```

We save the type of `input` in a local variable `inputType`. This memoization is very important for optimization purposes, since `inputType` will be invoked within the inner loop of the function.

```javascript
         var inputType = type (input);
```

If the value is neither an object or an array, we wrap it in an array so that we can treat it as an array with a single element. Notice that we also change `inputType` to `array`.

```javascript
         if (inputType !== 'array' && inputType !== 'object') input = [input], inputType = 'array';
```

Here we detect whether `input` is an `arguments` object. If that's the case, we set `inputType` to `array`.

```javascript
         if (inputType === 'object' && Object.prototype.toString.call (input) === '[object Arguments]') inputType = 'array';
```

The loop to end all loops:

```javascript
         for (var key in input) {
```

If three conditions are met simultaneously, we skip the current `key`, by issuing a `continue` statement. These conditions are:
- `input` is an object.
- `inherit` is not set.
- `input` has `key` as an inherited property.

Note that we use `Object.prototype.hasOwnProperty`, in case `input.hasOwnProperty` [was overwritten with another function](http://stackoverflow.com/a/12017703).

```javascript
            if (inputType === 'object' && ! inherit && ! Object.prototype.hasOwnProperty.call (input, key)) continue;
```

`input [key]` is the item currently being read by the loop (let's call it `value`). We apply the `value` and the `key` to the `fun`, and store the result in a variable.

Notice that the `fun` receives the `value` as the first argument and the `key` as the second. This inversion is useful since usually the `fun` needs the `value` but not the `key`. In this case, with this argument ordering you can write `function (v) {...}` instead of `function (k, v) {...}`.

Notice that if `input` is an array or an `arguments` object, we apply `parseInt` to the key. This is because javascript returns stringified numeric iterators (`'0'`, `'1'`, `'2'`...) when looping an array, instead of numeric keys.

This operation is the reason we checked whether `input` was an `arguments` object, so that we could `parseInt` its keys.

```javascript
            var result = fun (input [key], inputType === 'array' ? parseInt (key) : key);
```

For the case of `dale.do`, or the case of `dale.fil` when `result` is not equal to `middleArg`, we just push `result` into `output`.

We also issue a `continue` statement, because if we're in this branch there's nothing else to do in this iteration of the loop.

```javascript
            if (what === 'do' || (what === 'fil' && result !== middleArg)) {
               output.push (result);
               continue;
            }
```

For the case of `dale.stop`, if the `result` is equal to `middleArg`, we return `result` to break the loop. Otherwise, we set `output` to `result` and issue a `continue` statement.

```javascript
            if (what === 'stop') {
               if (result === middleArg) return result;
               output = result;
               continue;
            }
```

For the case of `dale.stopNot`, if the `result` is not equal to `middleArg`, we return `result` to break the loop. Otherwise, we set `output` to `result` and issue a `continue` statement.

```javascript
            if (what === 'stopNot') {
               if (result !== middleArg) return result;
               output = result;
               continue;
            }
```
For the case of `dale.obj`, if `result` is neither an array nor `undefined`, we print an error and return `undefined`.

```javascript
            if (what === 'obj') {
               if (result !== undefined && type (result) !== 'array') return console.log ('Value returned by fun must be an array but instead is of type ' + type (result));
```

Otherwise, if result is not `undefined` (hence an array), we set the key `result [0]` of `output` to `result [1]`.

```javascript
               if (result !== undefined)   output [result [0]] = result [1];
            }
```

We close the loop and return `output`.

```javascript
         }
         return output;
      }
   }
```

### The seven functions

We create each of the dale functions. `dale.keys` is simply a lambda function that passes `input` and `inherit` to `dale.do`, using a `fun` that only returns its `key`.

```javascript
   dale.do      = make ('do');
   dale.fil     = make ('fil');
   dale.obj     = make ('obj');
   dale.stop    = make ('stop');
   dale.stopNot = make ('stopNot');
   dale.keys      = function (input, inherit) {return dale.do (input, function (v, k) {return k}, inherit)};
```

`dale.times` is meant as a replacement for while loops where we iterate through integers. This function takes `times` (the number of iterations) and a `fun` (a string which can be either `do`, `fil`, `obj`, `stop`, `stopNot` and, `keys`).

```javascript
   dale.times   = function (times, fun) {
```

We want to create an array with the form `[1, 2, 3, 4, ..., times - 1, times]`, where times is an integer. For this, we build a while loop.

```javascript
      var i = 1;
      var input = [];
      while (i <= integer) {
         input.push (i++);
      }
```

Note that if `times` is 0, we will get an empty array, which is correct.

We finally return the result of applying `input` (plus other arguments that might be passed) to `dale [fun]`.

```javascript
      return dale [fun].apply (undefined, [input].concat ([].slice.call (arguments, 2)));
   }
```

We close the module.

```javascript
}) ();
```

## License

dale is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
