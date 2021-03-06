/*
dale - v6.0.2

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/

(function () {

   // *** SETUP ***

   var isNode = typeof exports === 'object';

   if (isNode) var dale = exports;
   else        var dale = window.dale = {};

   var argdetect = (function () {return Object.prototype.toString.call (arguments).match ('arguments')}) ();

   var type = function (value, objectType) {
      var type = typeof value;
      if (type === 'function') return Object.prototype.toString.call (value).match (/regexp/i) ? 'regex' : 'function';
      if (type !== 'object' && type !== 'number') return type;
      if (value instanceof Array) return 'array';
      if (type === 'number') {
         if      (isNaN (value))      return 'nan';
         else if (! isFinite (value)) return 'infinity';
         else if (value % 1 === 0)    return 'integer';
         else                         return 'float';
      }
      if (value === null) return 'null';
      type = Object.prototype.toString.call (value).replace ('[object ', '').replace (']', '').toLowerCase ();
      if (type === 'array' || type === 'date') return type;
      if (type === 'regexp') return 'regex';
      if (objectType) return argdetect ? type : (type (value.callee) === 'function' ? 'arguments' : type);
      return 'object';
   }

   try {
      dale.clog = console.log.bind (console);
   }
   catch (error) {
      dale.clog = function () {
         var output = dale.go (arguments, function (v) {return v === undefined ? 'undefined' : v}).join (' ');
         window.console ? window.console.log (output) : alert (output);
      }
   }

   // *** THE MAIN FUNCTION ***

   var make = function (what) {
      return function (input, second, third, fourth) {

         if      (what === 'go')              var fun = second, inherit = third  === true, output = [], index = 0;
         else if (what === 'fil')             var fun = third,  inherit = fourth === true, output = [], index = 0;
         else if (what !== 'obj')             var fun = third,  inherit = fourth === true, output;
         else if (type (second) === 'object') var fun = third,  inherit = fourth === true, output = second;
         else                                 var fun = second, inherit = third  === true, output = {};

         if (type (fun) !== 'function') {
            dale.clog (((what === 'go' || (what === 'obj' && type (second) !== 'object')) ? 'Second' : 'Third') + ' argument passed to dale.' + what + ' must be a function but instead is', fun, 'with type', type (fun));
            return false;
         }

         if (input === undefined) return output;

         if (what === 'go')       var inner = function (result) {output [index++] = result}
         else if (what === 'fil') var inner = function (result) {
            if (result !== second) output [index++] = result;
         }
         else if (what === 'obj') var inner = function (result) {
            if (result === undefined) return;
            if (type (result) !== 'array' || result.length !== 2) {
               dale.clog (type (result) === 'array' ? ('fun passed to dale.obj must return undefined or an array of length 2 but instead returned an array of length ' + result.length) : ('fun passed to dale.obj must return undefined or an array of length 2 but instead returned a value of type ' + type (result)));
               output = false;
               return true;
            }
            output [result [0]] = result [1];
         }
         else var inner = function (result) {
            output = result;
            return what === 'stop' ? result === second : result !== second;
         }

         var inputType = type (input);

         if (inputType === 'object') {
            if (Object.prototype.toString.call (input) === '[object Arguments]' || (! argdetect && type (input.callee) === 'function')) inputType = 'array', input = [].slice.call (input);
         }

         if (inputType === 'array') {
            for (var key = 0; key < input.length; key++) {
               if (inner (fun (input [key], parseInt (key)))) break;
            }
         }
         else if (inputType === 'object') {
            for (var key in input) {
               if (! inherit && input.hasOwnProperty && ! input.hasOwnProperty (key)) continue;
               if (inner (fun (input [key], key))) break;
            }
         }
         else inner (fun (input, 0));

         return output;
      }
   }

   // *** THE EIGHT FUNCTIONS ***

   dale.go      = make ('go');
   dale.fil     = make ('fil');
   dale.obj     = make ('obj');
   dale.stop    = make ('stop');
   dale.stopNot = make ('stopNot');
   dale.keys    = function (input, inherit) {return dale.go (input, function (v, k) {return k}, inherit)};
   dale.times   = function (steps, start, step) {
      if (steps === 0) return [];
      if (type (steps) !== 'integer' || steps < 0) {
         dale.clog ('steps must be a positive integer or zero.');
         return false;
      }
      if (start === undefined) start = 1;
      else if (type (start) !== 'integer' && type (start) !== 'float') {
         dale.clog ('start must be an integer or float.');
         return false;
      }
      if (step  === undefined) step  = 1;
      else if (type (step) !== 'integer'  && type (step)  !== 'float') {
         dale.clog ('step must be an integer or float.');
         return false;
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
         dale.clog ('fun must be a function but instead is of type', type (fun));
         return false;
      }
      var first = true;
      dale.go (input, function (v, k) {
         if (! hasAcc && first) {
            first = false;
            return acc = v;
         }
         acc = fun (acc, v);
      }, inherit);

      return acc;
   }
}) ();
