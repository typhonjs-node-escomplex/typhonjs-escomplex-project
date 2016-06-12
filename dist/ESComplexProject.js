'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ESComplexModule = require('typhonjs-escomplex-module/dist/ESComplexModule.js');

var _ESComplexModule2 = _interopRequireDefault(_ESComplexModule);

var _Plugins = require('./Plugins.js');

var _Plugins2 = _interopRequireDefault(_Plugins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Provides a runtime to invoke ESComplexProject plugins for processing / metrics calculations of projects.
 */

var ESComplexProject = function () {
   /**
    * Initializes ESComplexProject.
    *
    * @param {object}   options - module and project options including user plugins to load including:
    * ```
    * (object)             module - Provides an object hash of the following options for the module runtime:
    *    (boolean)         loadDefaultPlugins - When false ESComplexModule will not load any default plugins.
    *    (Array<Object>)   plugins - A list of ESComplexModule plugins that have already been instantiated.
    *
    * (object)             project - Provides an object hash of the following options for the project runtime:
    *    (boolean)         loadDefaultPlugins - When false ESComplexProject will not load any default plugins.
    *    (Array<Object>)   plugins - A list of ESComplexProject plugins that have already been instantiated.
    * ```
    */

   function ESComplexProject() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, ESComplexProject);

      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
         throw new TypeError('ctor error: `options` is not an `object`.');
      }

      this._plugins = new _Plugins2.default(options.project);

      this._escomplexModule = new _ESComplexModule2.default(options.module);
   }

   /**
    * Processes the given modules and calculates project metrics via plugins.
    *
    * @param {Array}    modules - Array of object hashes containing `ast` and `path` entries.
    * @param {object}   options - (Optional) project processing options.
    *
    * @returns {{reports: Array<{}>}}
    */


   _createClass(ESComplexProject, [{
      key: 'analyze',
      value: function analyze(modules) {
         var _this = this;

         var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

         if (!Array.isArray(modules)) {
            throw new TypeError('analyze error: `modules` is not an `array`.');
         }
         if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
            throw new TypeError('analyze error: `options` is not an `object`.');
         }

         var settings = this._plugins.onConfigure(options);

         this._plugins.onProjectStart(settings);

         var reports = modules.map(function (m) {
            var report = void 0;

            if (m.path === '') {
               throw new Error('analyze error: Invalid path');
            }

            try {
               report = _this._escomplexModule.analyze(m.ast, options);
               report.path = m.path;
               return report;
            } catch (error) {
               // Include the module path to distinguish the actual offending entry.
               error.message = m.path + ': ' + error.message;
               throw error;
            }
         }, []);

         var results = { reports: reports };

         if (settings.skipCalculation) {
            return results;
         }

         this._plugins.onProjectEnd(results);

         return results;
      }

      /**
       * Processes existing project results and calculates metrics via plugins.
       *
       * @param {object}   results - An object hash with a `reports` entry that is an Array of module results.
       * @param {object}   options - (Optional) project processing options.
       *
       * @returns {{reports: Array<{}>}}
       */

   }, {
      key: 'processResults',
      value: function processResults(results) {
         var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

         if ((typeof results === 'undefined' ? 'undefined' : _typeof(results)) !== 'object') {
            throw new TypeError('processResults error: `results` is not an `object`.');
         }
         if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
            throw new TypeError('processResults error: `options` is not an `object`.');
         }

         var settings = this._plugins.onConfigure(options);

         this._plugins.onProjectStart(settings);
         this._plugins.onProjectEnd(results);

         return results;
      }

      // Asynchronous Promise based methods ----------------------------------------------------------------------------

      /**
       * Wraps in a Promise processing the given modules and calculates metrics via plugins.
       *
       * @param {Array}    modules - Array of object hashes containing `ast` and `path` entries.
       * @param {object}   options - project processing options
       *
       * @returns {Promise<{reports: Array<{}>}>}
       */

   }, {
      key: 'analyzeThen',
      value: function analyzeThen(modules) {
         var _this2 = this;

         var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

         return new Promise(function (resolve, reject) {
            try {
               resolve(_this2.analyze(modules, options));
            } catch (err) {
               reject(err);
            }
         });
      }

      /**
       * Wraps in a Promise processing of existing project results and calculates metrics via plugins.
       *
       * @param {object}   results - An object hash with a `reports` entry that is an Array of module results.
       * @param {object}   options - (Optional) project processing options.
       *
       * @returns {Promise<{reports: Array<{}>}>}
       */

   }, {
      key: 'processResultsThen',
      value: function processResultsThen(results) {
         var _this3 = this;

         var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

         return new Promise(function (resolve, reject) {
            try {
               resolve(_this3.processResults(results, options));
            } catch (err) {
               reject(err);
            }
         });
      }
   }]);

   return ESComplexProject;
}();

exports.default = ESComplexProject;
module.exports = exports['default'];