/*
dale - v2.1.8

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

   // *** THE MAIN FUNCTION ***

   function make (what) {
      return function (input) {

         var fun         = what === 'do' ? arguments [1] : arguments [2];
         var filterValue = what === 'do' ? undefined     : arguments [1];
         var inherit     = arguments [arguments.length - 1] === true ? true : false;

         if (type (fun) !== 'function') {
            console.log ((what === 'do' ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }

         var output = (what === 'do' || what === 'fil') ? [] : undefined;

         if (input === undefined) return output;

         var inputType = type (input);

         if (inputType !== 'array' && inputType !== 'object') input = [input];

         for (var key in input) {

            if (inputType === 'object' && ! inherit && ! Object.prototype.hasOwnProperty.call (input, key)) continue;

            if (inputType === 'array') key = parseInt (key);

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
   dale.keys      = function (input, inherit) {return dale.do (input, function (v, k) {return k}, inherit)};

}) ();
