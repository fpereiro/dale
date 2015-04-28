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

3. Provides functions (`stopOn` and `stopOnNot`) that allow you to exit the loop prematurely if a certain value is returned by an iteration. This allows for code that's more clear as well as more efficient.

   ```javascript

   var input = [1, 2, 'clank', 4];

   var output = [];

   for (var i in input) {
      if (typeof (input [i]) !== 'number') break;
      else output.push (input [i] * 10);
   }

   // output will be [10, 20]

   output = [];

   dale.stopOn (input, false, function (v, k) {
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

And you also can use it in node.js. To install: `npm install dale`

## Functions

dale consists of just five functions.

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

dale.fil ([{id: 1}, {id: 8}, {id: 14}], false, function (v) {
   if (v.id < 10) return v;
   else return false;
});
// returns [{id: 1}, {id: 8}]

var members = [
   {name: 'Pepe', active: true},
   {name: 'Dimitri', active: false},
   {name: 'Helmut', active: true}
];

dale.fil (members, false, function (v) {
   if (v.active === false) return false;
   else return {name: v.name};
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

### `dale.stopOn`

`dale.stopOn`, for stopping the iteration when finding a certain value:
   - Takes an `input`, a `stopOn value` and a `function`.
   - Just like `dale.do`, it iterates over the `input`. Two things can happen:
      - If the result of this application **is equal** to the `stopOn value`, the result is returned and no further iteration is performed.
      - If the result of this application **is not equal** to the `stopOn value`, the iteration continues.
   - If the `input` is iterated completely without finding the `stopOn value`, the result of the last application is returned.
   - If the `input` has zero elements (because it is an empty object, empty array, or `undefined`, `dale.stopOn` returns `undefined`.

This function, just like `dale.stopOnNot` below, has two qualities that distinguish it from the other functions:
- It can stop the iteration before reaching the end of the `input`.
- It returns a single result, instead of an array of results.

```javascript

function isNumber (value) {
   if (typeof (value) === 'number') return true;
   else return false;
}

dale.stopOn ([2, 3, 4],       false, isNumber)    // returns true
dale.stopOn ([2, 'trois', 4], false, isNumber)    // returns false
dale.stopOn ([],              true,  isNumber)    // returns undefined
dale.stopOn (undefined,       true,  isNumber)    // returns undefined

```

### `dale.stopOnNot`

`dale.stopOnNot` is the complementary function to `dale.stopOn`. The only difference is that it stops when it finds a value that is **not** equal to the comparison value (which we name `stopOnNot value`).

```javascript

function returnIfNotNumber (value) {
   if (typeof (value) === 'number') return true;
   else return value;
}

dale.stopOnNot ([2, 3, 4],       true, returnIfNotNumber)    // returns true
dale.stopOnNot ([2, 'trois', 4], true, returnIfNotNumber)    // returns 'trois'
dale.stopOnNot ([],              true, returnIfNotNumber)    // returns undefined

```

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

dale is necessarily slower than a `for` loop, since it consists of a wrapper on top of it. The (very approximate) performance factors are the following:

```
Iterating arrays:

for:  1x
dale: 1.5x

Iterating objects:

for:                                    1x
dale:                                   3.25x
dale, without the hasOwnProperty check: 2.25x
```

This means that dale takes 50% more time when iterating arrays and between 125% and 225% more time when iterating objects. Although significant, I believe this is a worthy price to pay for the ease of expression and the facilities provided by dale - especially since many of these facilities have to be inserted into the loops anyway, hence bringing down the speed of the `for` loop.

I am pretty sure that the difference between the performance for arrays and objects has to do with the underlying implementation of javascript, since the code paths for arrays and objects in dale are almost identical.

The benchmark is included in `example.js` - to execute it just run that file, or open it in a browser. The benchmark attempts to make many iterations without almost any computation, to focus on the raw speed of the underlying loop (be it a real loop or dale's layer on top of it).

The results above were calculated in node, where presumably you will do heavy use of dale. In Google Chrome, dale's performance with objects is somewhat better than in node (1.5x). In Firefox, dale's performance with objects is considerably slower (5x-7x). Interestingly enough, in both browsers dale's performance with arrays is also about 1.5x.

## Source code

The complete source code is contained in `dale.js`. It is about 90 lines long.

Below is the annotated source.

```javascript
/*
dale - v2.1.8

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

- Distinguish between `object`, `array`, `regex`, `date` and `null` (all of which return `object` in `typeof`).
- Distinguish between types of numbers: `nan`, `infinity`, `integer` and `float` (all of which return `number` in `typeof`).

`type` takes a single argument (of any type, naturally) and returns a string which can be any of: `nan`, `infinity`, `integer`, `float`, `object`, `array`, `regex`, `date`, `null`, `function`, `string` and `undefined`.

```javascript
   function type (value) {
      var type = typeof value;
      if (type !== 'object' && type !== 'number') return type;
      if (type === 'number') {
         if      (isNaN (value))      return 'nan';
         else if (! isFinite (value)) return 'infinity';
         else if (value % 1 === 0)    return 'integer';
         else                         return 'float';
      }
      if (value === null) return 'null';
      type = Object.prototype.toString.call (value);
      if (type === '[object Object]') return 'object';
      if (type === '[object Array]')  return 'array';
      if (type === '[object RegExp]') return 'regex';
      if (type === '[object Date]')   return 'date';
   }
```

### The main function

All five functions of dale have many common elements. As a result, I've factored out the common elements in the function `make` below (short for `make function`).

`make` function receives a `what` argument (can be any of `'do'`, `'fil'`, `'stopOn'`, `'stopOnNot'`). It will then return the corresponding dale function.

`dale.keys` is implemented below as a special form of `dale.do`, so the function below is actually concerned with the other four functions.

```javascript
   function make (what) {
      return function (input) {
```

All dale functions receive a `fun` as their last argument. In the case of `dale.do`, `fun` is the second argument. However, in the case of `dale.fil`, `dale.stopOn` and `dale.stopOnNot`, we specify the `filterValue`/`stopOnValue`/`stopOnNotValue` as the second argument (we'll name it `filterValue` in the code), hence the `fun` is the third argument.


```javascript
         var fun         = what === 'do' ? arguments [1] : arguments [2];
         var filterValue = what === 'do' ? undefined     : arguments [1];
```

We set the `inherit` flag, which if enabled will iterate through the inherited properties of an object.

If the last argument passed to the function is `true`, we set it to `true`, otherwise we set it to `false`. Note that every dale function (with the exception of `dale.keys`, which is defined as a special case outside of `make`) receives `fun` as its last required argument. This means that a boolean flag cannot be possibly confused with `fun`.

```javascript
         var inherit     = arguments [arguments.length - 1] === true ? true : false;
```
We check the type of the arguments. Since `input` and `filterValue` can be anything, we just need to check that `fun` is indeed a function.

If `fun` is not a function, we log an error and return `false`.

```javascript
         if (type (fun) !== 'function') {
            console.log ((what === 'do' ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }
```

We set up the `output` variable. For `dale.do` and `dale.fil`, we always return an array - hence the default output will be an empty array. For `dale.stopOn` and `dale.stopOnNot`, we always return a single element - hence the default output will be `undefined`.

```javascript
         var output = (what === 'do' || what === 'fil') ? [] : undefined;
```

For any dale function, if the `input` is `undefined`, we return the default `output`. Notice that in this case, the function returns without executing the `fun` even once.

```javascript
         if (input === undefined) return output;
```

We save the type of `input` in a local variable `inputType`. This memoization is very important for optimization purposes, since `inputType` will be invoked within the inner loop of the function.

```javascript
         var inputType = type (input);
```

If the value is neither an object or an array, we wrap it in an array so that we can treat it as an array with a single element.

```javascript
         if (inputType !== 'array' && inputType !== 'object') input = [input];
```

The loop to end all loops:

```javascript
         for (var key in input) {
```

If three conditions are met simultaneously, we skip the current `key`, by issuing a `continue` statement. These conditions are:
- `input` is an object.
- `inherit` is not set to `true`.
- `input` has `key` as an inherited property.

Note that we use `Object.prototype.hasOwnProperty`, in case `input.hasOwnProperty` [was overwritten with another function](http://stackoverflow.com/a/12017703).

```javascript
            if (inputType === 'object' && ! inherit && ! Object.prototype.hasOwnProperty.call (input, key)) continue;
```

If `input` is an array, we apply `parseInt` to the key. This is because javascript returns stringified numeric iterators (`'0'`, `'1'`, `'2'`...) when looping an array, instead of numeric keys.

```javascript
            if (inputType === 'array') key = parseInt (key);
```

`input [key]` is the item currently being read by the loop (let's call it `value`). We apply the `value` and the `key` to the `fun`, and store the result in a variable.

Notice that the `fun` receives the `value` as the first argument and the `key` as the second. This inversion is useful since usually the `fun` needs the `value` but not the `key`. In this case, with this argument ordering you can write `function (v) {...}` instead of `function (k, v) {...}`.

```javascript
            var result = fun (input [key], key);
```

For the case of `dale.do`, we just push `result` into `output`.

```javascript
            if      (what === 'do')        output.push (result);
```

For the case of `dale.fil`, if `result` is different from `filterValue`, we push it into `output`.

```javascript
            else if (what === 'fil') {
               if (result !== filterValue) output.push (result);
            }
```

If we are inside the conditional below, we are dealing with `stopOn` or `stopOnNot`.

```javascript
            else {
```

For the case of `stopOn`, if the `result` is equal to the `filterValue`, we return `result` to break the loop. For the case of `stopOn`, if the `result` is **not** equal to the `filterValue`, we return `result` and also break the loop.

If the loop wasn't broken, we set `output` to `result`.

```javascript
               if      (what === 'stopOn'    && result === filterValue) return result;
               else if (what === 'stopOnNot' && result !== filterValue) return result;
               else    output = result;
            }
```

We close the loop and return `output`.

```javascript
         }
         return output;
      }
   }
```

### The five functions

We create each of the dale functions. `dale.keys` is simply a lambda function that passes `input` and `inherit` to `dale.do`, using a `fun` that only returns its `key`.

```javascript
   dale.do        = make ('do');
   dale.fil       = make ('fil');
   dale.stopOn    = make ('stopOn');
   dale.stopOnNot = make ('stopOnNot');
   dale.keys      = function (input, inherit) {return dale.do (input, function (v, k) {return k}, inherit)};
```

We close the module.

```javascript
}) ();
```

## License

dale is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
