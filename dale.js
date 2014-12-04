/*
dale - v2.1.1

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/

(function () {

   // *** SETUP ***

   var isNode = typeof exports === 'object';

   if (isNode) var dale = exports;
   else        var dale = window.dale = {};

   function type (value) {
      var type = typeof value;
      if (type === 'number') {
         if      (isNaN (value))      type = 'nan';
         else if (! isFinite (value)) type = 'infinity';
         else if (value % 1 === 0)    type = 'integer';
         else                         type = 'float';
      }
      if (type === 'object') {
         if (value === null)                                               type = 'null';
         if (Object.prototype.toString.call (value) === '[object Array]')  type = 'array';
         if (Object.prototype.toString.call (value) === '[object RegExp]') type = 'regex';
      }
      return type;
   }

   // *** THE MAIN FUNCTION ***

   function make (what) {
      return function (input) {

         var fun         = what === 'do' ? arguments [1] : arguments [2];
         var filterValue = what === 'do' ? undefined     : arguments [1];

         if (type (fun) !== 'function') {
            console.log ((what === 'do' ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }

         var output = (what === 'do' || what === 'fil') ? [] : undefined;

         if (input === undefined) return output;

         if (type (input) !== 'array' && type (input) !== 'object') input = [input];

         for (var key in input) {

            key = type (input) === 'array' ? parseInt (key) : key;

            var result = fun (input [key], key);

            if      (what === 'do')        output.push (result);

            else if (what === 'fil') {
               if (result !== filterValue) output.push (result);
            }

            else {
               if      (what === 'stopOn'    && result === filterValue) return result;
               else if (what === 'stopOnNot' && result !== filterValue) return result;
               else    output = result;
            }
         }

         return output;
      }
   }

   // *** THE FIVE FUNCTIONS ***

   dale.do        = make ('do');
   dale.fil       = make ('fil');
   dale.stopOn    = make ('stopOn');
   dale.stopOnNot = make ('stopOnNot');
   dale.keys      = function (input) {return dale.do (input, function (v, k) {return k})};

}) ();
