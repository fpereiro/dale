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
   });

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

   for (var i in input) {
      if (typeof (input [i]) !== 'number') break;
      else input [i] = input [i] * 10;
   }

   // input will now be [10, 20, 'clank', 4]

   input = dale.stopOn (input, false, function (v, k) {
      if (typeof (v) === false) return false;
      else return v * 10;
   });

   // input will now be [10, 20, 'clank', 4]

   ```

4. It is functional, so you can invoke dale functions within object literals to generate parts of them in a very compact and elegant way. This is probably the greatest advantage of them all.

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

dale.do (members, false, function (v) {
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

This function, just like `dale.stopOnNot` below, has two qualities that distinguish it from the other functions:
- It can stop the iteration before reaching the end of the `input`.
- It returns a single result, instead of an array of results.

`dale.stopOn`, for stopping the iteration when finding a certain value:
   - Takes an `input`, a `stopOn value` and a `function`.
   - Just like `dale.do`, it iterates over the `input`. Two things can happen:
      - If the result of this application **is equal** to the `stopOn value`, the result is returned and no further iteration is performed.
      - If the result of this application is **not** equal to the `stopOn value`, the iteration continues.
   - If the `input` is iterated completely without finding the `stopOn value`, the result of the last application is returned.
   - If the `input` has zero elements (because it is an empty object, empty array, or `undefined`, `dale.stopOn` returns `undefined`.

```javascript

function isNumber (value) {
   if (typeof (value) === 'number') return true;
   else return false;
}

dale.stopOn ([2, 3, 4], false, isNumber)          // returns true
dale.stopOn ([2, 'trois', 4], false, isNumber)    // returns false
dale.stopOn ([], true, isNumber)                  // returns undefined
dale.stopOn (undefined, true, isNumber)           // returns undefined

```

### `dale.stopOnNot`

`dale.stopOnNot` is the complementary function to `dale.stopOn`. The only difference is that it stops when it finds a value that is **not** equal to the comparison value (which we name `stopOnNot value`.

```javascript

function returnIfNotNumber (value) {
   if (typeof (value) === 'number') return true;
   else return value;
}

dale.stopOnNot ([2, 3, 4],       true, returnIfNotNumber)          // returns true
dale.stopOnNot ([2, 'trois', 4], true, returnIfNotNumber)          // returns 'trois'
dale.stopOn ([],                 true, returnIfNotNumber)          // returns undefined

```

## Source code

The complete source code is contained in `dale.js`. It is about 90 lines long.

## License

lith is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
