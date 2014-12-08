/*
dale - v2.1.2

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Run the examples by either including the script in a webpage or by running `node example` at the command prompt.
*/

(function () {

   var isNode = typeof exports === 'object';

   var dale = isNode ? require ('./dale.js') : window.dale;

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

   var input = [1, 2, 'clank', 4];

   var output = [];

   for (var i in input) {
      if (typeof (input [i]) !== 'number') break;
      else output.push (input [i] * 10);
   }

   console.log (output);

   // output will be [10, 20]

   output = [];

   dale.stopOn (input, false, function (v, k) {
      if (typeof (v) !== 'number') return false;
      else output.push (v * 10);
   });

   console.log (output);

   // output will be [10, 20]

   var data = {
      key: 'value',
      key2: [1, 2, 3],
      key3: dale.do ([1, 2, 3, 4], function (v) {
         return v * 10;
      })
   }

   console.log (data.key3);

   // data.key3 will be equal to [10, 20, 30, 40]

   console.log (dale.do ([1, 2, 3], function (v) {return v + 1}));
   // returns [2, 3, 4]

   console.log (dale.do ({a: 1, b: 2, c: 3}, function (v) {return v + 1}));
   // returns [2, 3, 4]

   console.log (dale.do (1, function (v) {return v + 1}));
   // returns [2]

   console.log (dale.do ({a: 1, b: 2, c: 3}, function (v, k) {return k + v}));
   // returns ['a1', 'b2', 'c3']

   console.log (dale.do ([], function (v, k) {return v + 1}));
   // returns []

   console.log (dale.do ({}, function (v, k) {return v + 1}));
   // returns []

   console.log (dale.do (undefined, function (v, k) {return v + 1}));
   // returns []

   console.log (dale.fil ([{id: 1}, {id: 8}, {id: 14}], false, function (v) {
      if (v.id < 10) return v;
      else return false;
   }));

   // returns [{id: 1}, {id: 8}]

   var members = [
      {name: 'Pepe', active: true},
      {name: 'Dimitri', active: false},
      {name: 'Helmut', active: true}
   ];

   console.log (dale.fil (members, false, function (v) {
      if (v.active === false) return false;
      else return {name: v.name};
   }));

   // returns [{name: 'Pepe'}, {name: 'Helmut'}]

   console.log (dale.keys ({'foo': true, 'bar': false, 'hip': undefined}));
   // returns ['foo', 'bar', 'hip']

   function isNumber (value) {
      if (typeof (value) === 'number') return true;
      else return false;
   }

   console.log (dale.stopOn ([2, 3, 4],       false, isNumber));    // returns true
   console.log (dale.stopOn ([2, 'trois', 4], false, isNumber));    // returns false
   console.log (dale.stopOn ([],              true,  isNumber));    // returns undefined
   console.log (dale.stopOn (undefined,       true,  isNumber));    // returns undefined

   function returnIfNotNumber (value) {
      if (typeof (value) === 'number') return true;
      else return value;
   }

   console.log (dale.stopOnNot ([2, 3, 4],       true, returnIfNotNumber));    // returns true
   console.log (dale.stopOnNot ([2, 'trois', 4], true, returnIfNotNumber));    // returns 'trois'
   console.log (dale.stopOnNot ([],              true, returnIfNotNumber));    // returns undefined

}) ();
