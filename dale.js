/*
dale - v3.2.1

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

         if      (what === 'do')              var fun = second, inherit = third  === true, output = [];
         else if (what === 'fil')             var fun = third,  inherit = fourth === true, middleArg = second, output = [];
         else if (what !== 'obj')             var fun = third,  inherit = fourth === true, middleArg = second, output;
         else if (type (second) === 'object') var fun = third,  inherit = fourth === true, output = second;
         else                                 var fun = second, inherit = third  === true, output = {};

         if (input === undefined) return output;

         if (type (fun) !== 'function') {
            console.log (((what === 'do' || (what === 'obj' && type (second) !== 'object')) ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }

         var inputType = type (input);

         if (inputType !== 'array' && inputType !== 'object') input = [input], inputType = 'array';
         if (inputType === 'object' && Object.prototype.toString.call (input) === '[object Arguments]') inputType = 'array';

         for (var key in input) {

            if (inputType === 'object' && ! inherit && ! Object.prototype.hasOwnProperty.call (input, key)) continue;

            var result = fun (input [key], inputType === 'array' ? parseInt (key) : key);

            if (what === 'do' || (what === 'fil' && result !== middleArg)) {
               output.push (result);
               continue;
            }
            if (what === 'stop') {
               if (result === middleArg) return result;
               output = result;
               continue;
            }
            if (what === 'stopNot') {
               if (result !== middleArg) return result;
               output = result;
               continue;
            }
            if (what === 'obj') {
               if (result !== undefined && type (result) !== 'array') return console.log ('Value returned by fun must be an array but instead is of type ' + type (result));
               if (result !== undefined)   output [result [0]] = result [1];
            }
         }
         return output;
      }
   }

   // *** THE SEVEN FUNCTIONS ***

   dale.do      = make ('do');
   dale.fil     = make ('fil');
   dale.obj     = make ('obj');
   dale.stop    = make ('stop');
   dale.stopNot = make ('stopNot');
   dale.keys    = function (input, inherit) {return dale.do (input, function (v, k) {return k}, inherit)};
   dale.times   = function (times, fun) {
      var i = 1;
      var input = [];
      while (i <= times) {
         input.push (i++);
      }
      return dale [fun].apply (undefined, [input].concat ([].slice.call (arguments, 2)));
   }

}) ();
