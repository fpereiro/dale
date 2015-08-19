/*
dale - v2.4.0

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
      return function (input) {

         var middleArg = what === 'do' ? undefined     : (what !== 'obj' ? arguments [1] : (type (arguments [1]) === 'object' ? arguments [1] : {}));
         var fun       = what === 'do' ? arguments [1] : (what !== 'obj' ? arguments [2] : (type (arguments [1]) === 'object' ? arguments [2] : arguments [1]));
         var inherit   = arguments [arguments.length - 1] === true ? true : false;

         if (type (fun) !== 'function') {
            console.log (((what === 'do' || (what === 'obj' && type (arguments [1]) !== 'object')) ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }

         var output = (what === 'do' || what === 'fil') ? [] : (what === 'obj' ? middleArg : undefined);

         if (input === undefined) return output;

         var inputType = type (input);

         if (inputType !== 'array' && inputType !== 'object') input = [input];
         if (inputType === 'object' && Object.prototype.toString.call (input) === '[object Arguments]') inputType = 'arguments';

         for (var key in input) {

            if (inputType === 'object' && ! inherit && ! Object.prototype.hasOwnProperty.call (input, key)) continue;

            if (inputType === 'array' || inputType === 'arguments') key = parseInt (key);

            var result = fun (input [key], key);

            if      (what === 'do')        output.push (result);

            else if (what === 'fil') {
               if (result !== middleArg) output.push (result);
            }

            else if (what === 'obj') {
               if (result !== undefined && type (result) !== 'array') return console.log ('Value returned by fun must be an array but instead is of type ' + type (result));
               if (result !== undefined)   output [result [0]] = result [1];
            }
            else {
               if      (what === 'stopOn'    && result === middleArg) return result;
               else if (what === 'stopOnNot' && result !== middleArg) return result;
               else    output = result;
            }
         }
         return output;
      }
   }

   // *** THE SIX FUNCTIONS ***

   dale.do        = make ('do');
   dale.fil       = make ('fil');
   dale.obj       = make ('obj');
   dale.stopOn    = make ('stopOn');
   dale.stopOnNot = make ('stopOnNot');
   dale.keys      = function (input, inherit) {return dale.do (input, function (v, k) {return k}, inherit)};

}) ();
