/*
dale - v1.0.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to README.md to see what this is about.
*/

(function () {

   // This code allows us to export the lith in the browser and in the server.
   // Taken from http://backbonejs.org/docs/backbone.html
   var root = this;
   var dale;
   if (typeof exports !== 'undefined') {
      dale = exports;
   }
   else {
      dale = root.dale = {};
   }

   /*
      The two functions below (type and is_integer) are copypasted from teishi (https://github.com/fpereiro/teishi). This is because I needed dale when writing teishi more than I needed teishi when writing dale; thus, I decided that teishi should depend on dale. And I don't know if I can elegantly cross-reference both libraries (taking just what I need and avoiding circular dependencies).
   */

   // Taken from http://javascript.crockford.com/remedial.html and modified to add detection of regexes.
   function type (value) {
      var type = typeof value;
      if (type === 'object') {
         if (value) {
            if (Object.prototype.toString.call (value) == '[object Array]') {
               type = 'array';
            }
            if (value instanceof RegExp) {
               type = 'regex';
            }
         } else {
            type = 'null';
         }
      }
      return type;
   }

   function is_integer (value) {
      return type (value) === 'number' && (value % 1 === 0);
   }

   // Error reporting function.
   function e () {
      if (console) console.log (arguments);
      return false;
   }

   dale.do = function (value, fun) {
      if (type (fun) !== 'function') return e ('The second argument of dale.do must be a function but instead is', fun, 'with type', type (fun));

      // Output is always an array.
      var output = [];

      if (value === undefined) return output;

      if (type (value) !== 'array' && type (value) !== 'object') {
         // We wrap the value in an array, so that we can treat it as such.
         value = [value];
      }

      for (var key in value) {
         /*
            We apply parseInt on the key passed to the function in the case that we're dealing with an array.
            For some reason, javascript returns stringified numeric iterators when looping an array, instead of numeric keys:

            This code:
               for (var iterator in [1, 2, 3]) {
                  console.log (iterator, typeof iterator)
               }

            Prints:
               0 string
               1 string
               2 string
         */
         type (value) === 'array' ? key = parseInt (key) : key;
         output.push (fun (value [key], key));
      }
      return output;
   }

   dale.stop_on = function (value, stop_on_value, fun) {
      if (type (fun) !== 'function') return e ('The second argument of dale.do must be a function but instead is', fun, 'with type', type (fun));

      if (value === undefined) return [];

      if (type (value) !== 'array' && type (value) !== 'object') {
         // We wrap the value in an array, so that we can treat it as such.
         value = [value];
      }

      var last_result;
      for (var key in value) {
         // To understand the use of parseInt here, please see the comment in function dale.do above.
         type (value) === 'array' ? key = parseInt (key) : key;
         var result = fun (value [key], key);
         if (result === stop_on_value) return stop_on_value;
         else last_result = result;
      }
      // If we reached the end of the loop, we return the last result.
      return last_result;
   }

   dale.times = function (times, fun) {
      if (is_integer (times) === false) {
         return e ('First argument to dale.times must be an integer but instead is', fun);
      }
      var array = [];
      for (var i = 1; i <= times; i++) {
         array.push (i);
      }
      return dale.do (array, fun);
   }

}).call (this);
