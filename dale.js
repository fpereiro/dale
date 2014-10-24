/*
dale - v2.0.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
*/

(function () {

   // *** SETUP ***

   var isNode = typeof exports === 'object';

   if (isNode) var dale = exports;
   else        var dale = window.dale = {};

   // The function below is copypasted from teishi (https://github.com/fpereiro/teishi). This is because I needed dale when writing teishi more than I needed teishi when writing dale; thus, I decided that teishi should depend on dale. And I don't know if I can elegantly cross-reference both libraries (taking just what I need and avoiding circular dependencies).
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

   // All five dale functions are very similar. I've factored out the common elements in the function below, which is for internal use only. Notice the FUNCTION CORE section below, which comprises the core differences between the functions. Notice that dale.keys is implemented below as a special form of dale.do, so the function below is actually concerned with the other four functions.
   function make (what) {
      return function (value) {
         var fun         = what === 'do' ? arguments [1] : arguments [2];
         var filterValue = what === 'do' ? undefined     : arguments [1];
         // We check the type of fun.
         if (type (fun) !== 'function') {
            console.log ((what === 'do' ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }
         // We don't check the type of filterValue, because it can be anything, even undefined.

         // We setup the output variable. For dale.do and dale.fil, we always return an array. For dale.stopOn and dale.stopOnNot, we always return a single element.
         var output = (what === 'do' || what === 'fil') ? [] : undefined;

         // For any function, passing undefined as a value returns the default value (which can be either an empty array or undefined).
         if (value === undefined) return output;

         // If the value is neither an object or an array, we wrap it in an array so that we can treat it as such using a for loop.
         if (type (value) !== 'array' && type (value) !== 'object') value = [value];

         for (var key in value) {
            // We apply parseInt on the key passed to the function in the case that we're dealing with an array. This is because javascript returns stringified numeric iterators when looping an array, instead of numeric keys.
            key = type (value) === 'array' ? parseInt (key) : key;

            var result = fun (value [key], key);

            // FUNCTION CORE
            if      (what === 'do')        output.push (result);
            else if (what === 'fil') {
               // If 'result' is equal to 'filterValue', it is not pushed to the 'output' array.
               if (result !== filterValue) output.push (result);
            }
            else {
               // 'stopOn' and 'stopOnNot' can make the function to return early, depending on the relationship between 'result' and 'filterValue'.
               if      (what === 'stopOn'    && result === filterValue) return result;
               else if (what === 'stopOnNot' && result !== filterValue) return result;
               else    output = result;
            }
            // END OF FUNCTION CORE
         }
         return output;
      }
   }

   // *** THE FIVE FUNCTIONS ***

   dale.do        = make ('do');
   dale.fil       = make ('fil');
   dale.stopOn    = make ('stopOn');
   dale.stopOnNot = make ('stopOnNot');
   dale.keys      = function (value) {return dale.do (value, function (v, k) {return k})};

}) ();
