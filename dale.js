/*
dale - v4.3.3

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/

(function () {

   // *** SETUP ***

   var isNode = typeof exports === 'object';

   if (isNode) var dale = exports;
   else        var dale = window.dale = {};

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

   // *** THE MAIN FUNCTION ***

   var make = function (what) {
      return function (input, second, third, fourth) {

         if      (what === 'do')              var fun = second, inherit = third  === true, output = [], index = 0;
         else if (what === 'fil')             var fun = third,  inherit = fourth === true, output = [], index = 0;
         else if (what !== 'obj')             var fun = third,  inherit = fourth === true, output;
         else if (type (second) === 'object') var fun = third,  inherit = fourth === true, output = second;
         else                                 var fun = second, inherit = third  === true, output = {};

         if (type (fun) !== 'function') {
            console.log (((what === 'do' || (what === 'obj' && type (second) !== 'object')) ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }

         if (input === undefined) return output;

         var inputType = type (input);

         if      (inputType === 'array')  {}
         else if (inputType === 'object') {
            if (Object.prototype.toString.call (input) === '[object Arguments]') inputType = 'array', input = [].slice.call (input);
         }
         else inputType = 'array', input = [input];

         for (var key in input) {

            if (inputType === 'array') key = parseInt (key);
            else {
               if (! inherit && ! Object.prototype.hasOwnProperty.call (input, key)) continue;
            }

            var result = fun (input [key], key);

            if      (what === 'do')   output [index++] = result;
            else if (what === 'fil') {
               if (result !== second) output [index++] = result;
            }
            else if (what === 'stop') {
               if (result === second) return result;
               output = result;
            }
            else if (what === 'stopNot') {
               if (result !== second) return result;
               output = result;
            }
            else {
               if (result === undefined) continue;
               if (type (result) !== 'array') {
                  console.log ('Value returned by fun must be an array but instead is of type ' + type (result));
                  return;
               }
               output [result [0]] = result [1];
            }
         }
         return output;
      }
   }

   // *** THE EIGHT FUNCTIONS ***

   dale.do      = make ('do');
   dale.fil     = make ('fil');
   dale.obj     = make ('obj');
   dale.stop    = make ('stop');
   dale.stopNot = make ('stopNot');
   dale.keys    = function (input, inherit) {return dale.do (input, function (v, k) {return k}, inherit)};
   dale.times   = function (steps, start, step) {
      if (steps === 0) return [];
      if (type (steps) !== 'integer' || steps < 0) {
         console.log ('steps must be a positive integer or zero.');
         return;
      }
      if (start === undefined) start = 1;
      else if (type (start) !== 'integer' && type (start) !== 'float') {
         console.log ('start must be an integer or float.');
         return;
      }
      if (step  === undefined) step  = 1;
      else if (type (step) !== 'integer'  && type (step)  !== 'float') {
         console.log ('step must be an integer or float.');
         return;
      }

      var output = [start];
      while (output.length < steps) {
         start += step;
         output.push (start);
      }
      return output;
   }

   dale.acc = function (input, second, third, fourth) {
      var hasAcc  = arguments.length === (type (arguments [arguments.length - 1]) === 'boolean' ? 4 : 3);
      var acc     = hasAcc ? second : undefined;
      var fun     = hasAcc ? third  : second;
      var inherit = hasAcc ? fourth : third;
      if (type (fun) !== 'function') {
         console.log ('fun must be a function but instead is of type', type (fun));
         return false;
      }
      var first = true;
      dale.do (input, function (v, k) {
         if (! hasAcc && first) {
            first = false;
            return acc = v;
         }
         acc = fun (acc, v);
      }, inherit);

      return acc;
   }

}) ();
